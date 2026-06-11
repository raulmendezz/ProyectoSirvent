import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AmazonModule } from '../amazon/amazon.module';
import { AlertsModule } from '../alerts/alerts.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AmazonModule, AlertsModule, PrismaModule],
  providers: [WorkerService],
})
export class WorkerModule {}
