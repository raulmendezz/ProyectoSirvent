import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AmazonModule } from '../amazon/amazon.module';
import { AlertsModule } from '../alerts/alerts.module';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [AmazonModule, AlertsModule, PrismaModule, InvoicesModule, LogsModule],
  providers: [WorkerService],
})
export class WorkerModule {}
