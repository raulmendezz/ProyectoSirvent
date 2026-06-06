import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// The NestJS API is only accessed from the Next.js server (localhost).
// User-facing IP checks are enforced in the Next.js middleware.
const ALWAYS_ALLOWED = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private readonly envAllowed: string[];

  constructor() {
    this.envAllowed = (process.env.ALLOWED_IPS ?? '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean);
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    if (ALWAYS_ALLOWED.includes(ip) || this.envAllowed.includes(ip)) {
      return next();
    }

    throw new ForbiddenException(`IP no autorizada: ${ip}`);
  }
}
