import { Module } from '@nestjs/common';
import { AmazonAuthService } from './amazon-auth.service';
import { AmazonOrdersService } from './amazon-orders.service';
import { AmazonInventoryService } from './amazon-inventory.service';
import { AmazonCatalogService } from './amazon-catalog.service';
import { AmazonNotificationsService } from './amazon-notifications.service';
import { AmazonController } from './amazon.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [AmazonController],
  providers: [
    AmazonAuthService,
    AmazonOrdersService,
    AmazonInventoryService,
    AmazonCatalogService,
    AmazonNotificationsService,
  ],
  exports: [
    AmazonAuthService,
    AmazonOrdersService,
    AmazonInventoryService,
    AmazonCatalogService,
    AmazonNotificationsService,
  ],
})
export class AmazonModule {}
