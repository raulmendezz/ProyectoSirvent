import { Injectable } from '@nestjs/common';
import { LogLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  log(
    level: LogLevel,
    source: string,
    message: string,
    meta?: Record<string, unknown>,
    userId?: number,
  ) {
    return this.prisma.log.create({
      data: { level, source, message, meta: meta as any, userId },
    });
  }

  findAll(limit = 200) {
    return this.prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { email: true } } },
    });
  }

  findBySource(source: string, limit = 50) {
    return this.prisma.log.findMany({
      where: { source },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
