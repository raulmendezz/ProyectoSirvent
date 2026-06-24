import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.product.findUniqueOrThrow({ where: { id } });
  }

  findLowStock() {
    return this.prisma.$queryRaw<
      { id: number; sku: string; name: string; stock: number; minStock: number }[]
    >`SELECT id, sku, nombre AS name, stock_total AS stock, minStock FROM products WHERE stock_total <= minStock AND activo = 1`;
  }
}
