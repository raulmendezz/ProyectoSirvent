import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface LowStockProduct {
  sku: string;
  name: string;
  stock: number;
  minStock: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
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

  async sendLowStockAlert(products: LowStockProduct[]) {
    const recipients = this.config.get<string>('EMAIL_RECIPIENTS', '');
    if (!recipients) {
      this.logger.warn('EMAIL_RECIPIENTS no configurado, alerta de stock omitida');
      return;
    }

    const rows = products
      .map(
        (p) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd">${p.sku}</td>
          <td style="padding:8px;border:1px solid #ddd">${p.name}</td>
          <td style="padding:8px;border:1px solid #ddd;color:#e53e3e;font-weight:bold">${p.stock}</td>
          <td style="padding:8px;border:1px solid #ddd">${p.minStock}</td>
        </tr>`,
      )
      .join('');

    const html = `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#e53e3e">⚠️ Alerta de Stock Bajo — Sirvent</h2>
        <p>${products.length} producto(s) han bajado del mínimo de stock configurado.</p>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f7fafc">
              <th style="padding:8px;border:1px solid #ddd;text-align:left">SKU</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Nombre</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Stock Actual</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="color:#718096;font-size:12px;margin-top:16px">
          Enviado automáticamente por Sirvent Admin · ${new Date().toLocaleString('es-ES')}
        </p>
      </div>`;

    await this.transporter.sendMail({
      from: `"Sirvent Admin" <${this.config.get('EMAIL_USER')}>`,
      to: recipients,
      subject: `⚠️ Stock bajo en ${products.length} producto(s) — Sirvent`,
      html,
    });

    this.logger.log(`Alerta de stock bajo enviada a: ${recipients}`);
  }
}
