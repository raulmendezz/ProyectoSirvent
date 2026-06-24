import {
  Controller, Get, Post, Delete,
  Param, Query, Body, Headers,
  UseGuards, HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AmazonOrdersService } from './amazon-orders.service';
import { AmazonInventoryService } from './amazon-inventory.service';
import { AmazonCatalogService } from './amazon-catalog.service';
import { AmazonNotificationsService } from './amazon-notifications.service';

@Controller('amazon')
export class AmazonController {
  constructor(
    private orders: AmazonOrdersService,
    private inventory: AmazonInventoryService,
    private catalog: AmazonCatalogService,
    private notifications: AmazonNotificationsService,
  ) {}

  // ─── SP-API endpoints (JWT protegido) ─────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  getOrders(@Query('days') days?: string) {
    const daysBack = days ? parseInt(days, 10) : 7;
    const createdAfter = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return this.orders.getOrders(createdAfter);
  }

  @UseGuards(JwtAuthGuard)
  @Get('inventory')
  getInventory() {
    return this.inventory.getInventorySummaries();
  }

  @UseGuards(JwtAuthGuard)
  @Get('catalog/:asin')
  getCatalogItem(@Param('asin') asin: string) {
    return this.catalog.getCatalogItem(asin);
  }

  @UseGuards(JwtAuthGuard)
  @Get('catalog')
  searchCatalog(@Query('q') keywords: string) {
    return this.catalog.searchCatalogItems(keywords);
  }

  // ─── Gestión de suscripciones (JWT protegido) ─────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('notifications/destinations')
  listDestinations() {
    return this.notifications.listDestinations();
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/destinations')
  createDestination(@Body() body: { sqsArn: string; name: string }) {
    return this.notifications.createDestination(body.sqsArn, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications/subscriptions/:type')
  listSubscriptions(@Param('type') type: string) {
    return this.notifications.listSubscriptions(type);
  }

  @UseGuards(JwtAuthGuard)
  @Post('notifications/subscriptions/:type')
  createSubscription(
    @Param('type') type: string,
    @Body() body: { destinationId: string },
  ) {
    return this.notifications.createSubscription(type, body.destinationId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('notifications/subscriptions/:type/:id')
  deleteSubscription(@Param('type') type: string, @Param('id') id: string) {
    return this.notifications.deleteSubscription(type, id);
  }

  // ─── Webhook receptor SNS (público — Amazon no envía JWT) ─────────────────

  @Post('notifications/webhook')
  @HttpCode(200)
  receiveWebhook(
    @Body() body: any,
    @Headers('x-amz-sns-message-type') messageType: string,
  ) {
    this.notifications.handleWebhook(body, messageType ?? 'Notification');
    return { received: true };
  }
}
