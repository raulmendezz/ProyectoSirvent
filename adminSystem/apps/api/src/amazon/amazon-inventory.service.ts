import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmazonAuthService } from './amazon-auth.service';

const BASE_URL = 'https://sellingpartnerapi-eu.amazon.com';

@Injectable()
export class AmazonInventoryService {
  private readonly logger = new Logger(AmazonInventoryService.name);

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
  ) {}

  async getInventorySummaries(): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const marketplaceId = this.config.getOrThrow('AMAZON_MARKETPLACE_ID');

    const { data } = await axios.get(`${BASE_URL}/fba/inventory/v1/summaries`, {
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
