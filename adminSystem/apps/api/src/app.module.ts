import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { IpWhitelistMiddleware } from './common/middleware/ip-whitelist.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InventoryModule,
    LogsModule,
    AlertsModule,
    AmazonModule,
    WhitelistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpWhitelistMiddleware).forRoutes('*');
  }
}
