import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AlertsService } from './alerts.service';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private alerts: AlertsService) {}

  @Get()
  findAll() {
    return this.alerts.findAll();
  }

  @Patch(':id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number) {
    return this.alerts.resolve(id);
  }
}
