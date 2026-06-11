import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AmazonOrdersService } from './amazon-orders.service';
import { AmazonInventoryService } from './amazon-inventory.service';
import { AmazonCatalogService } from './amazon-catalog.service';

@UseGuards(JwtAuthGuard)
@Controller('amazon')
export class AmazonController {
  constructor(
    private orders: AmazonOrdersService,
    private inventory: AmazonInventoryService,
    private catalog: AmazonCatalogService,
  ) {}

  @Get('orders')
  getOrders(@Query('days') days?: string) {
    const daysBack = days ? parseInt(days, 10) : 7;
    const createdAfter = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return this.orders.getOrders(createdAfter);
  }

  @Get('inventory')
  getInventory() {
    return this.inventory.getInventorySummaries();
  }

  @Get('catalog/:asin')
  getCatalogItem(@Param('asin') asin: string) {
    return this.catalog.getCatalogItem(asin);
  }

  @Get('catalog')
  searchCatalog(@Query('q') keywords: string) {
    return this.catalog.searchCatalogItems(keywords);
  }
}
