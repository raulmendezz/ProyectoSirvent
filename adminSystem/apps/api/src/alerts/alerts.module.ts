import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { EmailService } from './email.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlertsController],
  providers: [AlertsService, EmailService],
  exports: [AlertsService],
})
export class AlertsModule {}
