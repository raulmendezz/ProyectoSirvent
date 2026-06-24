import { Controller, Get, Post, Patch, Param, Query, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { invoices_estado } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InvoicesService } from './invoices.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @Get()
  findAll(
    @Query('estado') estado?: invoices_estado,
    @Query('days') days?: string,
  ) {
    return this.invoices.findAll({
      estado,
      days: days ? parseInt(days, 10) : undefined,
    });
  }

  @Get('stats')
  getStats() {
    return this.invoices.getStats();
  }

  @Post('generate-pending')
  generatePending() {
    return this.invoices.generatePending();
  }

  @Post('order/:orderId')
  generateForOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.invoices.generateForOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoices.findOne(id);
  }

  @Patch(':id/estado')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: invoices_estado,
  ) {
    return this.invoices.updateStatus(id, estado);
  }
}
