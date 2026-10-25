import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendEmailProvider } from './providers/resend.provider';
import { SendGridEmailProvider } from './providers/sendgrid.provider';
import { SmtpEmailProvider } from './providers/smtp.provider';

@Module({
  providers: [EmailService, ResendEmailProvider, SendGridEmailProvider, SmtpEmailProvider],
  exports: [EmailService],
})
export class EmailModule {}
