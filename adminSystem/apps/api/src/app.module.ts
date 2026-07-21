import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InventoryModule } from './inventory/inventory.module';
import { LogsModule } from './logs/logs.module';
import { AlertsModule } from './alerts/alerts.module';
import { AmazonModule } from './amazon/amazon.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { WorkerModule } from './worker/worker.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TrackingModule } from './tracking/tracking.module';
import { IpWhitelistMiddleware } from './common/middleware/ip-whitelist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    LogsModule,
    AuthModule,
    UsersModule,
    InventoryModule,
    AlertsModule,
    AmazonModule,
    WorkerModule,
    WhitelistModule,
    InvoicesModule,
    TrackingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*');
  }
}
