import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { orders_estado } from '@prisma/client';
import { AmazonOrdersService } from '../amazon/amazon-orders.service';
import { AmazonInventoryService } from '../amazon/amazon-inventory.service';
import { AlertsService } from '../alerts/alerts.service';
import { LogsService } from '../logs/logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { InvoicesService } from '../invoices/invoices.service';

const STATUS_MAP: Record<string, orders_estado> = {
  Pending:             'pendiente',
  PendingAvailability: 'pendiente',
  Unshipped:           'confirmado',
  PartiallyShipped:    'confirmado',
  Shipped:             'enviado',
  Canceled:            'cancelado',
};

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);
  private lastSyncAt: Date | null = null;

  constructor(
    private amazonOrders: AmazonOrdersService,
    private amazonInventory: AmazonInventoryService,
    private alerts: AlertsService,
    private logs: LogsService,
    private prisma: PrismaService,
    private invoicesService: InvoicesService,
  ) {}

  @Cron('0 */5 * * * *')
  async syncAll() {
    this.logger.log('Iniciando sincronización con Amazon...');
    const started = Date.now();

    const [ordersResult, inventoryResult] = await Promise.allSettled([
      this.syncOrders(),
      this.syncInventory(),
    ]);

    if (ordersResult.status === 'rejected') {
      this.logger.error(`Error sync pedidos: ${ordersResult.reason}`);
    }
    if (inventoryResult.status === 'rejected') {
      this.logger.error(`Error sync inventario: ${inventoryResult.reason}`);
    }

    try {
      await this.alerts.checkLowStock();
    } catch (err: any) {
      this.logger.error(`Error check stock: ${err.message}`);
    }

    try {
      const { generated } = await this.invoicesService.generatePending();
      if (generated > 0) this.logger.log(`Facturas generadas automáticamente: ${generated}`);
    } catch (err: any) {
      this.logger.error(`Error generando facturas: ${err.message}`);
    }

    this.lastSyncAt = new Date();
    this.logger.log(`Sincronización completada en ${Date.now() - started}ms`);
  }

  async syncOrders() {
    let orders: any[];
    try {
      orders = await this.amazonOrders.getOrders(this.lastSyncAt ?? undefined);
    } catch (err: any) {
      await this.logs.log('ERROR', 'worker', `Error obteniendo pedidos Amazon: ${err.message}`, {
        error: err.response?.data ?? err.message,
      });
      throw err;
    }

    // Platform: upsert por slug (es el campo único en la tabla)
    const platform = await this.prisma.platform.upsert({
      where: { slug: 'amazon' },
      create: { nombre: 'Amazon', slug: 'amazon' },
      update: {},
    });

    let synced = 0;
    for (const order of orders) {
      try {
        const buyerName =
          order.BuyerInfo?.BuyerName ??
          order.BuyerInfo?.BuyerEmail ??
          'Desconocido';

        // Customer: upsert por nombre (campo único)
        const customer = await this.prisma.customer.upsert({
          where: { nombre: buyerName },
          create: { nombre: buyerName },
          update: {},
        });

        const estado = STATUS_MAP[order.OrderStatus] ?? 'pendiente';
        const total = parseFloat(order.OrderTotal?.Amount ?? '0');
        const fechaPedido = new Date(order.PurchaseDate);

        // Order: upsert por clave compuesta (platformId + externalOrderId)
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
            fechaPedido,
            customerId: customer.id,
            platformId: platform.id,
          },
          update: { estado, total },
        });
        synced++;
      } catch (err: any) {
        this.logger.warn(`Error insertando pedido ${order.AmazonOrderId}: ${err.message}`);
      }
    }

    await this.logs.log('INFO', 'worker', `Pedidos sincronizados: ${synced}/${orders.length}`);
  }

  async syncInventory() {
    let summaries: any[];
    try {
      summaries = await this.amazonInventory.getInventorySummaries();
    } catch (err: any) {
      await this.logs.log('ERROR', 'worker', `Error obteniendo inventario Amazon: ${err.message}`, {
        error: err.response?.data ?? err.message,
      });
      throw err;
    }

    let synced = 0;
    for (const item of summaries) {
      try {
        const qty =
          item.inventoryDetails?.fulfillableQuantity ??
          item.totalQuantity ??
          0;

        // Los campos usan @map: 'name'→'nombre', 'stock'→'stock_total', 'price'→'precio_base'
        await this.prisma.product.upsert({
          where: { sku: item.sellerSku },
          create: {
            sku: item.sellerSku,
            name: item.productName ?? item.sellerSku,
            stock: qty,
            price: 0,
            asin: item.asin ?? null,
          },
          update: {
            stock: qty,
            asin: item.asin ?? undefined,
          },
        });
        synced++;
      } catch (err: any) {
        this.logger.warn(`Error actualizando SKU ${item.sellerSku}: ${err.message}`);
      }
    }

    await this.logs.log('INFO', 'worker', `Inventario sincronizado: ${synced}/${summaries.length} SKUs`);
  }
}
