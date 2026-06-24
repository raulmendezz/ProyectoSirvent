import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AmazonAuthService } from './amazon-auth.service';

@Injectable()
export class AmazonCatalogService {
  private readonly logger = new Logger(AmazonCatalogService.name);
  private readonly baseUrl: string;

  constructor(
    private auth: AmazonAuthService,
    private config: ConfigService,
  ) {
    this.baseUrl = config.get('AMAZON_SANDBOX') === 'true'
      ? 'https://sandbox.sellingpartnerapi-eu.amazon.com'
      : 'https://sellingpartnerapi-eu.amazon.com';
  }

  async getCatalogItem(asin: string): Promise<any> {
    const token = await this.auth.getAccessToken();
    const marketplaceId = this.config.getOrThrow('AMAZON_MARKETPLACE_ID');

    const { data } = await axios.get(`${this.baseUrl}/catalog/2022-04-01/items/${asin}`, {
      headers: { 'x-amz-access-token': token },
      params: {
        marketplaceIds: marketplaceId,
        includedData: 'attributes,identifiers,images,summaries',
      },
    });

    return data;
  }

  async searchCatalogItems(keywords: string): Promise<any[]> {
    const token = await this.auth.getAccessToken();
    const marketplaceId = this.config.getOrThrow('AMAZON_MARKETPLACE_ID');

    const { data } = await axios.get(`${this.baseUrl}/catalog/2022-04-01/items`, {
      headers: { 'x-amz-access-token': token },
      params: {
        marketplaceIds: marketplaceId,
        keywords,
        includedData: 'attributes,identifiers,summaries',
      },
    });

    return data.items ?? [];
  }
}
