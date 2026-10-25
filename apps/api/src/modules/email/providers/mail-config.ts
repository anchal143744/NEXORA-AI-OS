import type { EmailMessage } from '../contracts/email-provider.contract';

export function mailSender(message: EmailMessage): string | null {
  const from = process.env.EMAIL_FROM?.trim();
  const address = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
  if (process.env.EMAIL_DELIVERY_ENABLED !== 'true' || !from || !address.test(from) || !address.test(message.to) || /[\r\n]/.test(message.subject)) return null;
  return from;
}

export async function sendMailApi(provider: 'resend' | 'sendgrid', message: EmailMessage) {
  const from = mailSender(message);
  const key = process.env[provider === 'resend' ? 'RESEND_API_KEY' : 'SENDGRID_API_KEY'];
  if (!from || !key?.trim()) return { provider, accepted: false };
  try {
    const response = await fetch(provider === 'resend' ? 'https://api.resend.com/emails' : 'https://api.sendgrid.com/v3/mail/send', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(provider === 'resend' ? { from, to: [message.to], subject: message.subject, html: message.html, ...(message.text ? { text: message.text } : {}) } : {
        personalizations: [{ to: [{ email: message.to }] }], from: { email: from }, subject: message.subject,
        content: [...(message.text ? [{ type: 'text/plain', value: message.text }] : []), { type: 'text/html', value: message.html }],
      }),
    });
    if (provider === 'sendgrid') {
      await response.body?.cancel();
      return { provider, accepted: response.status === 202, ...(response.status === 202 ? { id: response.headers.get('x-message-id') ?? undefined } : {}) };
    }
    if (response.status !== 200 && response.status !== 201) { await response.body?.cancel(); return { provider, accepted: false }; }
    const result: unknown = await response.json();
    const id = result && typeof result === 'object' && 'id' in result ? (result as { id: unknown }).id : null;
    return typeof id === 'string' && id.length > 0 ? { provider, accepted: true, id } : { provider, accepted: false };
  } catch { return { provider, accepted: false }; } // Never expose provider bodies, credentials or tokens.
}
