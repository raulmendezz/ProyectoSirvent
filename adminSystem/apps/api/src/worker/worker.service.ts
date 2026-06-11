import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AmazonOrdersService } from '../amazon/amazon-orders.service';
import { AmazonInventoryService } from '../amazon/amazon-inventory.service';
import { AlertsService } from '../alerts/alerts.service';
import { LogsService } from '../logs/logs.service';
import { PrismaService } from '../prisma/prisma.service';

const STATUS_MAP: Record<string, string> = {
  Pending: 'pendiente',
  PendingAvailability: 'pendiente',
  Unshipped: 'confirmado',
  PartiallyShipped: 'confirmado',
  Shipped: 'enviado',
  Canceled: 'cancelado',
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
  ) {}

  // Runs every 5 minutes
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

    // Check low stock after inventory sync
    try {
      await this.alerts.checkLowStock();
    } catch (err: any) {
      this.logger.error(`Error check stock: ${err.message}`);
    }

    this.lastSyncAt = new Date();
    this.logger.log(`Sincronización completada en ${Date.now() - started}ms`);
  }

  private async syncOrders() {
    let orders: any[];
    try {
      orders = await this.amazonOrders.getOrders(this.lastSyncAt ?? undefined);
    } catch (err: any) {
      await this.logs.log('ERROR', 'worker', `Error obteniendo pedidos Amazon: ${err.message}`, {
        error: err.response?.data ?? err.message,
      });
      throw err;
    }

    const platformId = await this.ensurePlatform('Amazon');
    let synced = 0;

    for (const order of orders) {
      try {
        const buyerName =
          order.BuyerInfo?.BuyerName ??
          order.BuyerInfo?.BuyerEmail ??
          'Desconocido';
        const customerId = await this.ensureCustomer(buyerName);
        const estado = STATUS_MAP[order.OrderStatus] ?? 'pendiente';
        const total = parseFloat(order.OrderTotal?.Amount ?? '0');
        const fechaPedido = new Date(order.PurchaseDate);

        await this.prisma.$executeRaw`
          INSERT INTO orders (external_order_id, estado, total, fecha_pedido, customer_id, platform_id)
          VALUES (${order.AmazonOrderId}, ${estado}, ${total}, ${fechaPedido}, ${customerId}, ${platformId})
          ON DUPLICATE KEY UPDATE estado = VALUES(estado), total = VALUES(total)
        `;
        synced++;
      } catch (err: any) {
        this.logger.warn(`Error insertando pedido ${order.AmazonOrderId}: ${err.message}`);
      }
    }

    await this.logs.log('INFO', 'worker', `Pedidos sincronizados: ${synced}/${orders.length}`);
  }

  private async syncInventory() {
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

  private async ensurePlatform(nombre: string): Promise<number> {
    const rows = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM platforms WHERE nombre = ${nombre} LIMIT 1
    `;
    if (rows.length > 0) return rows[0].id;

    await this.prisma.$executeRaw`INSERT INTO platforms (nombre) VALUES (${nombre})`;
    const [inserted] = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM platforms WHERE nombre = ${nombre} LIMIT 1
    `;
    return inserted.id;
  }

  private async ensureCustomer(nombre: string): Promise<number> {
    const rows = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM customers WHERE nombre = ${nombre} LIMIT 1
    `;
    if (rows.length > 0) return rows[0].id;

    await this.prisma.$executeRaw`INSERT INTO customers (nombre) VALUES (${nombre})`;
    const [inserted] = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM customers WHERE nombre = ${nombre} LIMIT 1
    `;
    return inserted.id;
  }
}
