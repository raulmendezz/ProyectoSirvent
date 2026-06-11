import { Module } from '@nestjs/common';
import { AmazonAuthService } from './amazon-auth.service';
import { AmazonOrdersService } from './amazon-orders.service';
import { AmazonInventoryService } from './amazon-inventory.service';
import { AmazonCatalogService } from './amazon-catalog.service';

@Module({
  providers: [
    AmazonAuthService,
    AmazonOrdersService,
    AmazonInventoryService,
    AmazonCatalogService,
  ],
  exports: [
    AmazonAuthService,
    AmazonOrdersService,
    AmazonInventoryService,
    AmazonCatalogService,
  ],
})
export class AmazonModule {}
