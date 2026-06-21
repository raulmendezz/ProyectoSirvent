import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LogsService } from './logs.service';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private logs: LogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.logs.findAll(limit ? Number(limit) : 200);
  }

  @Get('source')
  findBySource(@Query('source') source: string, @Query('limit') limit?: string) {
    return this.logs.findBySource(source, limit ? Number(limit) : 50);
  }
}
