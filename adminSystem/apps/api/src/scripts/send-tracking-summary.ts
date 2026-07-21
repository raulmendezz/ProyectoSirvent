/* =============================================================================
 * send-tracking-summary.ts — Dispara a mano el resumen de accesos por email.
 *
 * Uso (desde adminSystem/apps/api, tras compilar con `npm run build`):
 *     node dist/scripts/send-tracking-summary.js [email-destino]
 *
 * O con el atajo de npm:
 *     npm run tracking:resumen -- raulmendezsaez@gmail.com
 *
 * Si no pasas email, usa QR_EMAIL_TO o EMAIL_RECIPIENTS del .env.
 * Requiere que estén configuradas las credenciales SMTP (EMAIL_USER/EMAIL_PASS).
 * ========================================================================== */
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { TrackingService } from '../tracking/tracking.service';

async function main() {
  const to = process.argv[2] || undefined;
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const tracking = app.get(TrackingService);
    const result = await tracking.enviarResumenAhora(to);
    if (result?.sent) {
      Logger.log(
        `✅ Email enviado a ${result.to} · total=${result.total} movil=${result.movil} nuevos=${result.nuevos} qr=${result.qr}`,
        'send-tracking-summary',
      );
    } else {
      Logger.warn(
        `No se envió el email (${result?.reason ?? 'motivo desconocido'})`,
        'send-tracking-summary',
      );
    }
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  Logger.error(err?.stack ?? String(err), 'send-tracking-summary');
  process.exit(1);
});
