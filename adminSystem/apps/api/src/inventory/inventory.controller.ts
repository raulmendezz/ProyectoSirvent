import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  findLowStock() {
    return this.inventoryService.findLowStock();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }
}
