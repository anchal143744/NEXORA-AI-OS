import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { RedisCacheService } from '../../../infrastructure/redis/cache/redis-cache.service';
@Injectable()
export class WebhookValidator { constructor(private readonly cache: RedisCacheService) {}
  signature(secret: string, payload: unknown, timestamp: string) { return createHmac('sha256', secret).update(`${timestamp}.${JSON.stringify(payload)}`).digest('hex'); }
  async validate(input: { secret: string; payload: unknown; timestamp: string; signature: string; nonce: string; tenantId: string }) { const age = Math.abs(Date.now() - Number(input.timestamp)); if (age > 300000) throw new BadRequestException('Webhook timestamp outside replay window'); const replayKey = `webhook:${input.nonce}`; if (await this.cache.get('workspace', input.tenantId, replayKey)) throw new BadRequestException('Webhook replay detected'); const expected = this.signature(input.secret, input.payload, input.timestamp); const ok = timingSafeEqual(Buffer.from(expected), Buffer.from(input.signature)); if (!ok) throw new BadRequestException('Invalid webhook signature'); await this.cache.set('workspace', input.tenantId, replayKey, { seen: true }, 300); return true; }
}
