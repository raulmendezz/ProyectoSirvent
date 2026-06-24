import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmazonAuthService } from './amazon-auth.service';

@Injectable()
export class AmazonInventoryService {
  private readonly logger = new Logger(AmazonInventoryService.name);
  private readonly baseUrl: string;

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
  ) {
    this.baseUrl = config.get('AMAZON_SANDBOX') === 'true'
      ? 'https://sandbox.sellingpartnerapi-eu.amazon.com'
      : 'https://sellingpartnerapi-eu.amazon.com';
  }

  async getInventorySummaries(): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const marketplaceId = this.config.getOrThrow('AMAZON_MARKETPLACE_ID');

    const { data } = await axios.get(`${this.baseUrl}/fba/inventory/v1/summaries`, {
      headers: { 'x-amz-access-token': token },
      params: {
        granularityType: 'Marketplace',
        granularityId: marketplaceId,
        marketplaceIds: marketplaceId,
      },
    });

    const summaries: any[] = data.payload?.inventorySummaries ?? [];
    this.logger.log(`Obtenidos ${summaries.length} SKUs de inventario FBA`);
    return summaries;
  }
}
