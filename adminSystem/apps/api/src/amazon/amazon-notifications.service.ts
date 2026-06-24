import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { orders_estado } from '@prisma/client';
import { AmazonAuthService } from './amazon-auth.service';
import { AmazonOrdersService } from './amazon-orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';

const STATUS_MAP: Record<string, orders_estado> = {
  Pending:             'pendiente',
  PendingAvailability: 'pendiente',
  Unshipped:           'confirmado',
  PartiallyShipped:    'confirmado',
  Shipped:             'enviado',
  Canceled:            'cancelado',
};

@Injectable()
export class AmazonNotificationsService {
  private readonly logger = new Logger(AmazonNotificationsService.name);
  private readonly baseUrl: string;

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
    private orders: AmazonOrdersService,
    private prisma: PrismaService,
    private logs: LogsService,
  ) {
    this.baseUrl = config.get('AMAZON_SANDBOX') === 'true'
      ? 'https://sandbox.sellingpartnerapi-eu.amazon.com'
      : 'https://sellingpartnerapi-eu.amazon.com';
  }

  // ─── Webhook receiver ──────────────────────────────────────────────────────

  async handleWebhook(body: any, messageType: string): Promise<void> {
    if (messageType === 'SubscriptionConfirmation') {
      await this.confirmSnsSubscription(body.SubscribeURL);
      return;
    }

    if (messageType === 'Notification') {
      let payload: any;
      try {
        payload = typeof body.Message === 'string' ? JSON.parse(body.Message) : body.Message;
      } catch {
        this.logger.warn('No se pudo parsear el mensaje SNS');
        return;
      }

      const notificationType: string = payload.NotificationType ?? '';
      this.logger.log(`Notificación recibida: ${notificationType}`);

      switch (notificationType) {
        case 'ORDER_CHANGE':
          await this.handleOrderChange(payload.Payload?.OrderChangeNotification);
          break;
        case 'ITEM_INVENTORY_EVENT_CHANGE':
          await this.handleInventoryChange(payload.Payload?.InventoryEventChangeNotification);
          break;
        default:
          await this.logs.log('INFO', 'amazon-notifications', `Notificación no manejada: ${notificationType}`, payload);
      }
    }
  }

  private async confirmSnsSubscription(subscribeUrl: string): Promise<void> {
    try {
      await axios.get(subscribeUrl);
      this.logger.log('Suscripción SNS confirmada');
    } catch (err: any) {
      this.logger.error(`Error confirmando suscripción SNS: ${err.message}`);
    }
  }

  private async handleOrderChange(notification: any): Promise<void> {
    if (!notification?.AmazonOrderId) return;

    try {
      const order = await this.orders.getOrderById(notification.AmazonOrderId);
      if (!order) return;

      const platform = await this.prisma.platform.upsert({
        where: { slug: 'amazon' },
        create: { nombre: 'Amazon', slug: 'amazon' },
        update: {},
      });

      const buyerName =
        order.BuyerInfo?.BuyerName ?? order.BuyerInfo?.BuyerEmail ?? 'Desconocido';

      const customer = await this.prisma.customer.upsert({
        where: { nombre: buyerName },
        create: { nombre: buyerName },
        update: {},
      });

      const estado = STATUS_MAP[order.OrderStatus] ?? 'pendiente';
      const total = parseFloat(order.OrderTotal?.Amount ?? '0');

      await this.prisma.order.upsert({
        where: {
          platformId_externalOrderId: {
            platformId: platform.id,
            externalOrderId: order.AmazonOrderId,
          },
        },
        create: {
          externalOrderId: order.AmazonOrderId,
          estado,
          total,
          fechaPedido: new Date(order.PurchaseDate),
          customerId: customer.id,
          platformId: platform.id,
        },
        update: { estado, total },
      });

      await this.logs.log('INFO', 'amazon-notifications', `Pedido actualizado via webhook: ${order.AmazonOrderId} → ${estado}`);
    } catch (err: any) {
      await this.logs.log('ERROR', 'amazon-notifications', `Error procesando ORDER_CHANGE: ${err.message}`, { orderId: notification.AmazonOrderId });
    }
  }

  private async handleInventoryChange(notification: any): Promise<void> {
    if (!notification) return;
    await this.logs.log('INFO', 'amazon-notifications', 'Cambio de inventario recibido via webhook — se sincronizará en el próximo ciclo', notification);
  }

  // ─── Subscription management ───────────────────────────────────────────────

  async createDestination(sqsArn: string, name: string): Promise<any> {
    const token = await this.auth.getAccessToken();
    const { data } = await axios.post(
      `${this.baseUrl}/notifications/v1/destinations`,
      {
        resourceSpecification: { sqs: { arn: sqsArn } },
        name,
      },
      { headers: { 'x-amz-access-token': token } },
    );
    return data.payload;
  }

  async listDestinations(): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const { data } = await axios.get(`${this.baseUrl}/notifications/v1/destinations`, {
      headers: { 'x-amz-access-token': token },
    });
    return data.payload ?? [];
  }

  async createSubscription(notificationType: string, destinationId: string): Promise<any> {
    const token = await this.auth.getAccessToken();
    const { data } = await axios.post(
      `${this.baseUrl}/notifications/v1/subscriptions/${notificationType}`,
      { destinationId },
      { headers: { 'x-amz-access-token': token } },
    );
    await this.logs.log('INFO', 'amazon-notifications', `Suscripción creada: ${notificationType}`, data.payload);
    return data.payload;
  }

  async listSubscriptions(notificationType: string): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const { data } = await axios.get(
      `${this.baseUrl}/notifications/v1/subscriptions/${notificationType}`,
      { headers: { 'x-amz-access-token': token } },
    );
    return data.payload ?? [];
  }

  async deleteSubscription(notificationType: string, subscriptionId: string): Promise<void> {
    const token = await this.auth.getAccessToken();
    await axios.delete(
      `${this.baseUrl}/notifications/v1/subscriptions/${notificationType}/${subscriptionId}`,
      { headers: { 'x-amz-access-token': token } },
    );
    await this.logs.log('INFO', 'amazon-notifications', `Suscripción eliminada: ${notificationType}/${subscriptionId}`);
  }
}
