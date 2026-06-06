import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWhitelistEntryDto } from './dto/create-entry.dto';

@Injectable()
export class WhitelistService {
  constructor(private prisma: PrismaService) {}

  async getAllIps(): Promise<string[]> {
    const envIps = (process.env.ALLOWED_IPS ?? '127.0.0.1,::1')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);
    try {
      const entries = await this.prisma.ipWhitelistEntry.findMany({ select: { ip: true } });
      return [...new Set([...envIps, ...entries.map((e) => e.ip)])];
    } catch {
      return envIps;
    }
  }

  findAll() {
    return this.prisma.ipWhitelistEntry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateWhitelistEntryDto) {
    const exists = await this.prisma.ipWhitelistEntry.findUnique({ where: { ip: dto.ip } });
    if (exists) throw new ConflictException('La IP ya está en la lista');
    return this.prisma.ipWhitelistEntry.create({ data: dto });
  }

  async remove(id: number) {
    const entry = await this.prisma.ipWhitelistEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Entrada no encontrada');
    await this.prisma.ipWhitelistEntry.delete({ where: { id } });
    return { message: 'IP eliminada de la lista blanca' };
  }
}
