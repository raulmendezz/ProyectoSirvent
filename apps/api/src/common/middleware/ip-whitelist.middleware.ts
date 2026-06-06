import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly allowed: string[];

  constructor() {
    const raw = process.env.ALLOWED_IPS ?? '127.0.0.1,::1';
    this.allowed = raw.split(',').map((ip) => ip.trim());
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    if (this.allowed.includes(ip)) {
      return next();
    }

    throw new ForbiddenException(`IP no autorizada: ${ip}`);
  }
}
