import { Injectable } from '@nestjs/common';
import { EmailMessage, EmailProvider } from '../contracts/email-provider.contract';
import { createTransport } from 'nodemailer';
import { mailSender } from './mail-config';

@Injectable()
export class SmtpEmailProvider implements EmailProvider {
  readonly name = 'smtp';

  async send(message: EmailMessage) {
    const from = mailSender(message), host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT ?? 587);
    const local = process.env.NODE_ENV !== 'production' && process.env.SMTP_ALLOW_INSECURE_LOCAL === 'true' && ['127.0.0.1','localhost','::1'].includes(host ?? '');
    if (!from || !host || !Number.isInteger(port) || port < 1 || port > 65535 || (!local && (!process.env.SMTP_USER || !process.env.SMTP_PASS))) return { provider: this.name, accepted: false };
    const transport = createTransport({ host, port, secure: port === 465, requireTLS: !local, ignoreTLS: local,
      ...(process.env.SMTP_USER && process.env.SMTP_PASS ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } } : {}),
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, logger: false, debug: false,
      disableFileAccess: true, disableUrlAccess: true, tls: { rejectUnauthorized: true },
    });
    try {
      const result = await transport.sendMail({ from, to: message.to, subject: message.subject, html: message.html, text: message.text });
      return { provider: this.name, accepted: result.accepted?.includes(message.to) === true && !result.rejected?.includes(message.to), id: result.messageId };
    } catch { return { provider: this.name, accepted: false }; }
    finally { transport.close(); }
  }
}
