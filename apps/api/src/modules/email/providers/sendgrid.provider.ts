import { Injectable } from '@nestjs/common';
import { EmailMessage, EmailProvider } from '../contracts/email-provider.contract';
import { sendMailApi } from './mail-config';

@Injectable()
export class SendGridEmailProvider implements EmailProvider {
  readonly name = 'sendgrid';

  async send(message: EmailMessage) {
    return sendMailApi('sendgrid', message);
  }
}
