import { Injectable } from '@nestjs/common';
import { EmailMessage, EmailProvider } from '../contracts/email-provider.contract';
import { sendMailApi } from './mail-config';

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  readonly name = 'resend';

  async send(message: EmailMessage) {
    return sendMailApi('resend', message);
  }
}
