import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
@Injectable()
export class CredentialVault {
  private key() { return createHash('sha256').update(process.env.NEXORA_SECRET_KEY ?? 'nexora-local-development-secret').digest(); }
  encrypt(value: unknown) { const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', this.key(), iv); const body = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]); const tag = cipher.getAuthTag(); return Buffer.concat([iv, tag, body]).toString('base64'); }
  decrypt<T = unknown>(sealed: string): T { const raw = Buffer.from(sealed, 'base64'); const iv = raw.subarray(0,12); const tag = raw.subarray(12,28); const body = raw.subarray(28); const decipher = createDecipheriv('aes-256-gcm', this.key(), iv); decipher.setAuthTag(tag); return JSON.parse(Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8')) as T; }
  fingerprint(value: string) { return createHash('sha256').update(value).digest('hex'); }
}
