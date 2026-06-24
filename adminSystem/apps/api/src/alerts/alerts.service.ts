import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { EmailService, LowStockProduct } from './email.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
    private email: EmailService,
  ) {}

  async checkLowStock() {
    const products = await this.prisma.$queryRaw<(LowStockProduct & { id: number })[]>`
      SELECT id, sku, nombre AS name, stock_total AS stock, minStock
      FROM products
      WHERE stock_total <= minStock AND activo = 1
    `;

    if (products.length === 0) return;

    for (const p of products) {
      const existing = await this.prisma.alert.findFirst({
        where: { type: 'LOW_STOCK', productId: p.id, resolved: false },
      });
      if (!existing) {
        await this.prisma.alert.create({
          data: {
            type: 'LOW_STOCK',
            message: `Stock bajo: ${p.name} — actual: ${p.stock}, mínimo: ${p.minStock}`,
            productId: p.id,
          },
        });
      }
    }

    try {
      await this.email.sendLowStockAlert(products);
    } catch (err: any) {
      this.logger.error(`Error enviando email de alerta: ${err.message}`);
      await this.logs.log('ERROR', 'alerts', `Error email alerta stock: ${err.message}`, { error: err.message });
      return;
    }

    await this.logs.log('WARN', 'alerts', `Alerta stock bajo enviada: ${products.length} productos`);
  }

  findAll() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolve(id: number) {
    return this.prisma.alert.update({
      where: { id },
      data: { resolved: true },
    });
  }
}
