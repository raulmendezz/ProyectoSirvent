import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// The NestJS API is only accessed from the Next.js server (localhost).
// User-facing IP checks are enforced in the Next.js middleware.
const ALWAYS_ALLOWED = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

// Rutas públicas accesibles por visitantes anónimos (ping de tracking del QR
// desde la web pública). Es el ÚNICO endpoint abierto al exterior; el resto
// de la API sigue restringido por IP.
const PUBLIC_PATHS = ['/api/track'];

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
    // Usamos originalUrl porque, al montarse el middleware sobre la ruta, req.path
    // llega relativo ('/') y el path completo (con prefijo 'api') está aquí.
    const path = (req.originalUrl || req.url).split('?')[0];
    if (PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'))) {
      return next();
    }

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
