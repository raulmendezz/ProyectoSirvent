import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

@Injectable()
export class AmazonAuthService {
  private readonly logger = new Logger(AmazonAuthService.name);
  private tokenCache: TokenCache | null = null;

  constructor(private config: ConfigService) {}

  async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.accessToken;
    }
    return this.refreshToken();
  }

  private async refreshToken(): Promise<string> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.config.getOrThrow('AMAZON_REFRESH_TOKEN'),
      client_id: this.config.getOrThrow('AMAZON_CLIENT_ID'),
      client_secret: this.config.getOrThrow('AMAZON_CLIENT_SECRET'),
    });

    const { data } = await axios.post(
      'https://api.amazon.com/auth/o2/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    // Cache with 60s margin before expiry
    this.tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    this.logger.log('Access token de Amazon refrescado');
    return this.tokenCache.accessToken;
  }
}
