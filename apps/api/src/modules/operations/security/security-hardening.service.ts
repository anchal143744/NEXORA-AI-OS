import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class SecurityHardeningService {
  csp() { return { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], imgSrc: ["'self'", 'data:', 'https:'], connectSrc: ["'self'", 'https:', 'wss:'], objectSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'self'"], formAction: ["'self'"] }; }
  headers() { return { contentSecurityPolicy: true, crossOriginEmbedderPolicy: true, crossOriginOpenerPolicy: true, crossOriginResourcePolicy: true, referrerPolicy: 'no-referrer', noSniff: true, hsts: true, frameguard: 'DENY', permissionsPolicy: 'geolocation=(), microphone=(), camera=(), payment=()' }; }
  validateEncryptionSecret() { const raw = process.env.NEXORA_SECRET_KEY ?? process.env.JWT_SECRET ?? ''; return { valid: raw.length >= 32, fingerprint: raw ? createHash('sha256').update(raw).digest('hex').slice(0, 12) : null }; }
  validateEnvironment() { const required = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET']; const missing = required.filter((key) => !process.env[key]); return { valid: missing.length === 0, missing, required }; }
  secretRotationPlan() { return { oauthTokens: '90d', apiKeys: '180d', webhookSecrets: '90d', connectionSecrets: '90d', jwtSigningKeys: '180d', encryptionKeys: '365d' }; }
}