import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmazonAuthService } from './amazon-auth.service';

const BASE_URL = 'https://sandbox.sellingpartnerapi-eu.amazon.com';

@Injectable()
export class AmazonOrdersService {
  private readonly logger = new Logger(AmazonOrdersService.name);

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
  ) {}

  async getOrders(createdAfter?: Date): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const isSandbox = BASE_URL.includes('sandbox');

    // Sandbox requires static test-case values; real dates/marketplaces return 400
    const params = isSandbox
      ? { MarketplaceIds: 'ATVPDKIKX0DER', CreatedAfter: 'TEST_CASE_200' }
      : {
          MarketplaceIds: this.config.getOrThrow('AMAZON_MARKETPLACE_ID'),
          CreatedAfter: (createdAfter ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString(),
          OrderStatuses: 'Unshipped,PartiallyShipped,Shipped,Canceled,Pending',
        };

    const { data } = await axios.get(`${BASE_URL}/orders/v0/orders`, {
      headers: { 'x-amz-access-token': token },
      params,
    });

    const orders: any[] = data.payload?.Orders ?? [];
    this.logger.log(`Obtenidos ${orders.length} pedidos de Amazon`);
    return orders;
  }
}
