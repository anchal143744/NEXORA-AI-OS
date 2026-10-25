import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../infrastructure/redis/redis.service';

@Injectable()
export class RedisHealthService {
  constructor(private readonly redis: RedisService) {}

  async check() {
    const started = Date.now();
    if (!this.redis.isEnabled()) {
      return {
        status: process.env.NODE_ENV === 'production' ? 'error' : 'disabled',
        mode: process.env.NODE_ENV ?? 'development',
        message: 'Redis Disabled - Running Development Mode.',
        latencyMs: Date.now() - started,
      };
    }

    await this.redis.connect();
    const pong = await this.redis.client.ping();
    return { status: pong === 'PONG' ? 'ok' : 'degraded', latencyMs: Date.now() - started };
  }
}