import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.product.findUniqueOrThrow({ where: { id } });
  }

  findLowStock() {
    return this.prisma.$queryRaw<
      { id: number; sku: string; name: string; stock: number; minStock: number }[]
    >`SELECT id, sku, name, stock, minStock FROM Product WHERE stock <= minStock`;
  }
}
