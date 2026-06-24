import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmazonAuthService } from './amazon-auth.service';

@Injectable()
export class AmazonOrdersService {
  private readonly logger = new Logger(AmazonOrdersService.name);
  private readonly baseUrl: string;

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
  ) {
    this.baseUrl = config.get('AMAZON_SANDBOX') === 'true'
      ? 'https://sandbox.sellingpartnerapi-eu.amazon.com'
      : 'https://sellingpartnerapi-eu.amazon.com';
  }

  async getOrders(createdAfter?: Date): Promise<any[]> {
    const token = await this.auth.getAccessToken();

    const { data } = await axios.get(`${this.baseUrl}/orders/v0/orders`, {
      headers: { 'x-amz-access-token': token },
      params: {
        MarketplaceIds: this.config.getOrThrow('AMAZON_MARKETPLACE_ID'),
        CreatedAfter: (createdAfter ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString(),
        OrderStatuses: 'Unshipped,PartiallyShipped,Shipped,Canceled,Pending',
      },
    });

    const orders: any[] = data.payload?.Orders ?? [];
    this.logger.log(`Obtenidos ${orders.length} pedidos de Amazon`);
    return orders;
  }

  async getOrderById(amazonOrderId: string): Promise<any> {
    const token = await this.auth.getAccessToken();
    const { data } = await axios.get(`${this.baseUrl}/orders/v0/orders/${amazonOrderId}`, {
      headers: { 'x-amz-access-token': token },
    });
    return data.payload;
  }
}
