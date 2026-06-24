import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { invoices_estado } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
  ) {}

  // ─── Consultas ────────────────────────────────────────────────────────────

  findAll(filters?: { estado?: invoices_estado; days?: number }) {
    const where: any = {};
    if (filters?.estado) where.estado = filters.estado;
    if (filters?.days) {
      where.fecha_emision = {
        gte: new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000),
      };
    }
    return this.prisma.invoices.findMany({
      where,
      orderBy: { fecha_emision: 'desc' },
      include: {
        orders: {
          include: { customer: true, platform: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoices.findUnique({
      where: { id },
      include: {
        orders: {
          include: { customer: true, platform: true, order_items: { include: { products: true } } },
        },
      },
    });
    if (!invoice) throw new NotFoundException('Factura no encontrada');
    return invoice;
  }

  async getStats() {
    const rows = await this.prisma.$queryRaw<
      { estado: string; total: bigint; importe: number }[]
    >`
      SELECT estado, COUNT(*) AS total, COALESCE(SUM(total), 0) AS importe
      FROM invoices
      GROUP BY estado
    `;
    const stats = { pendiente: 0, emitida: 0, pagada: 0, anulada: 0 };
    const importe = { pendiente: 0, emitida: 0, pagada: 0, anulada: 0 };
    for (const r of rows) {
      stats[r.estado as keyof typeof stats] = Number(r.total);
      importe[r.estado as keyof typeof importe] = Number(r.importe);
    }
    return { count: stats, importe };
  }

  // ─── Generación automática ────────────────────────────────────────────────

  async generateForOrder(orderId: number): Promise<{ created: boolean; invoice: any }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    if (order.estado === 'cancelado') {
      throw new ConflictException('No se puede facturar un pedido cancelado');
    }

    const existing = await this.prisma.invoices.findUnique({
      where: { order_id: orderId },
    });
    if (existing) return { created: false, invoice: existing };

    const numero = await this.nextInvoiceNumber();
    const estado: invoices_estado =
      order.estado === 'enviado' || order.estado === 'entregado' ? 'emitida' : 'pendiente';

    const invoice = await this.prisma.invoices.create({
      data: {
        order_id: orderId,
        numero_factura: numero,
        total: order.total,
        estado,
        fecha_emision: new Date(),
      },
    });

    await this.logs.log('INFO', 'invoices', `Factura creada: ${numero} para pedido #${orderId}`);
    return { created: true, invoice };
  }

  // Genera facturas para todos los pedidos que no tienen factura y no están cancelados
  async generatePending(): Promise<{ generated: number; skipped: number }> {
    const orders = await this.prisma.order.findMany({
      where: {
        estado: { not: 'cancelado' },
        invoices: null,
      },
    });

    let generated = 0;
    let skipped = 0;

    for (const order of orders) {
      try {
        const { created } = await this.generateForOrder(order.id);
        if (created) generated++;
        else skipped++;
      } catch {
        skipped++;
      }
    }

    if (generated > 0) {
      await this.logs.log('INFO', 'invoices', `Generación masiva: ${generated} facturas creadas, ${skipped} omitidas`);
    }

    return { generated, skipped };
  }

  // ─── Actualización de estado ──────────────────────────────────────────────

  async updateStatus(id: number, estado: invoices_estado) {
    const invoice = await this.prisma.invoices.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Factura no encontrada');

    const updated = await this.prisma.invoices.update({
      where: { id },
      data: { estado, updated_at: new Date() },
    });

    await this.logs.log('INFO', 'invoices', `Factura ${invoice.numero_factura} → ${estado}`);
    return updated;
  }

  // ─── Numeración ───────────────────────────────────────────────────────────

  private async nextInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `FAC-${year}-`;

    const last = await this.prisma.invoices.findFirst({
      where: { numero_factura: { startsWith: prefix } },
      orderBy: { numero_factura: 'desc' },
    });

    const lastNum = last ? parseInt(last.numero_factura.split('-')[2], 10) : 0;
    return `${prefix}${String(lastNum + 1).padStart(4, '0')}`;
  }
}
