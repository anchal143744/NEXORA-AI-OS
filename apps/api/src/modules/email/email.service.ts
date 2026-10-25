import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { EmailProvider } from './contracts/email-provider.contract';
import { ResendEmailProvider } from './providers/resend.provider';
import { SendGridEmailProvider } from './providers/sendgrid.provider';
import { SmtpEmailProvider } from './providers/smtp.provider';

@Injectable()
export class EmailService {
  constructor(private readonly resend: ResendEmailProvider, private readonly sendGrid: SendGridEmailProvider, private readonly smtp: SmtpEmailProvider) {}

  provider(): EmailProvider {
    const selected = process.env.EMAIL_PROVIDER ?? 'smtp';
    if (selected === 'resend') return this.resend;
    if (selected === 'sendgrid') return this.sendGrid;
    if (selected === 'smtp') return this.smtp;
    throw new ServiceUnavailableException('Email provider is not configured.');
  }

  private content(token: string, tenantId?: string) {
    const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]!));
    return { html: `<p>Open NEXORA Account Recovery and use this email token:</p><p>${escape(token)}</p>${tenantId ? `<p>Business ID: ${escape(tenantId)}</p>` : ''}`, text: `${token}${tenantId ? `\nBusiness ID: ${tenantId}` : ''}\nOpen NEXORA → Forgot password or verify email. Never share this token with support.` };
  }
  async sendVerificationEmail(to: string, token: string, tenantId?: string) {
    const result = await this.provider().send({ to, subject: 'Verify your NEXORA AI account', ...this.content(token,tenantId) });
    if (!result.accepted) throw new ServiceUnavailableException('Email delivery is not configured. Contact your administrator.');
    return result;
  }

  async sendPasswordResetEmail(to: string, token: string, tenantId?: string) {
    const result = await this.provider().send({ to, subject: 'Reset your NEXORA AI password', ...this.content(token,tenantId) });
    if (!result.accepted) throw new ServiceUnavailableException('Email delivery is not configured. Contact your administrator.');
    return result;
  }
}
