import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

interface VisitInput {
  ref?: string;
  path?: string;
  ua?: string;
  nuevo?: string;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: Number(this.config.get('EMAIL_PORT', '587')),
      secure: false,
      auth: {
        user: this.config.get('EMAIL_USER', ''),
        pass: this.config.get('EMAIL_PASS', ''),
      },
    });
  }

  // El tracking NUNCA debe fallarle al visitante: si algo va mal, se ignora.
  async record(input: VisitInput) {
    try {
      const ua = input.ua ?? '';
      const ref = input.ref ?? '';
      const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
      const isDirect = !ref; // sin referrer = acceso directo (típico de un QR)

      await this.prisma.visit.create({
        data: {
          path: (input.path || '/').slice(0, 255),
          referrer: ref ? ref.slice(0, 500) : null,
          userAgent: ua ? ua.slice(0, 500) : null,
          device: isMobile ? 'movil' : 'escritorio',
          isNew: input.nuevo === '1',
          probableQr: isMobile && isDirect,
        },
      });
    } catch (err: any) {
      this.logger.warn(`No se pudo registrar la visita: ${err.message}`);
    }
  }

  // Resumen semanal: cada lunes a las 9:00 (hora de España).
  @Cron('0 0 9 * * 1', { timeZone: 'Europe/Madrid' })
  async sendWeeklySummary() {
    await this.enviarResumenAhora();
  }

  /**
   * Genera y envía el resumen de accesos de los últimos 7 días.
   * Lo usa el cron semanal y también se puede disparar a mano
   * (ver scripts/send-tracking-summary.ts) para pruebas.
   *
   * @param to Destinatario opcional. Si se omite, usa QR_EMAIL_TO o EMAIL_RECIPIENTS.
   */
  async enviarResumenAhora(to?: string) {
    const destino =
      to ||
      this.config.get<string>('QR_EMAIL_TO') ||
      this.config.get<string>('EMAIL_RECIPIENTS', '');
    if (!destino) {
      this.logger.warn(
        'Sin destinatario (pasa uno como argumento o define QR_EMAIL_TO/EMAIL_RECIPIENTS); resumen omitido',
      );
      return { sent: false, reason: 'sin-destinatario' as const };
    }

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const visits = await this.prisma.visit.findMany({
      where: { createdAt: { gte: since } },
    });

    const total = visits.length;
    const movil = visits.filter((v) => v.device === 'movil').length;
    const nuevos = visits.filter((v) => v.isNew).length;
    const qr = visits.filter((v) => v.probableQr).length;

    const fmt = (d: Date) => d.toLocaleDateString('es-ES');
    const desde = fmt(since);
    const hasta = fmt(new Date());

    const fila = (label: string, value: number) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${label}</td>
        <td style="padding:8px;border:1px solid #ddd;font-weight:bold;text-align:right">${value}</td>
      </tr>`;

    const html = `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#2b6cb0">📊 Accesos web Heladería Sirvent</h2>
        <p>Resumen de accesos a <b>heladossirvent.es</b> de los últimos 7 días
           (${desde} – ${hasta}):</p>
        <table style="width:100%;border-collapse:collapse">
          <tbody>
            ${fila('Accesos totales', total)}
            ${fila('Desde el móvil', movil)}
            ${fila('Visitantes nuevos', nuevos)}
            ${fila('Probable QR (móvil directo)', qr)}
          </tbody>
        </table>
        <p style="color:#718096;font-size:12px;margin-top:16px">
          Nota: como el QR apunta a la misma dirección que la web general, el número
          "Probable QR" es una estimación (accesos desde el móvil sin venir de otra web).
          El resto de cifras son exactas.
        </p>
        <p style="color:#718096;font-size:12px">
          Enviado automáticamente por la web · ${new Date().toLocaleString('es-ES')}
        </p>
      </div>`;

    await this.transporter.sendMail({
      from: `"Web Sirvent" <${this.config.get('EMAIL_USER')}>`,
      to: destino,
      subject: `📊 Accesos web Heladería Sirvent — ${desde} a ${hasta}`,
      html,
    });

    this.logger.log(
      `Resumen de accesos enviado a: ${destino} (${total} visitas)`,
    );
    return { sent: true as const, to: destino, total, movil, nuevos, qr };
  }
}
