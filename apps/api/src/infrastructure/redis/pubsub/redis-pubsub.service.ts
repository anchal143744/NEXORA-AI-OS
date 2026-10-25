import { Injectable, OnModuleInit } from '@nestjs/common';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { RedisService } from '../redis.service';

@Injectable()
export class RedisPubSubService implements OnModuleInit {
  constructor(private readonly redis: RedisService) {}
  async onModuleInit() { await this.redis.connect(); }

  async publish(channel: string, payload: unknown) {
    const span = tracingBackend.startSpan('redis.pubsub.publish', { kind: 'producer', attributes: { channel } }); const started = process.hrtime.bigint();
    try { await this.redis.connect(); await this.redis.publisher.publish(channel, JSON.stringify(payload)); this.record('publish', channel, started, this.redis.isEnabled() ? 'ok' : 'disabled'); tracingBackend.finishSpan(span, 'OK', { redisEnabled: this.redis.isEnabled() }); }
    catch (error) { this.record('publish', channel, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); if (process.env.NODE_ENV === 'production') throw error; }
  }

  async subscribe<T>(channel: string, handler: (payload: T) => Promise<void> | void) {
    await this.redis.connect();
    if (!this.redis.isEnabled()) {
      telemetryRegistry.incrementCounter('nexora_redis_pubsub_subscriptions_total', 1, { channel, status: 'disabled' });
      return;
    }
    await this.redis.subscriber.subscribe(channel); telemetryRegistry.incrementCounter('nexora_redis_pubsub_subscriptions_total', 1, { channel, status: 'ok' });
    this.redis.subscriber.on('message', async (receivedChannel, message) => {
      if (receivedChannel !== channel) return;
      const span = tracingBackend.startSpan('redis.pubsub.message', { kind: 'consumer', attributes: { channel } }); const started = process.hrtime.bigint();
      try { await handler(JSON.parse(message) as T); this.record('message', channel, started, 'ok'); tracingBackend.finishSpan(span, 'OK'); }
      catch (error) { this.record('message', channel, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); if (process.env.NODE_ENV === 'production') throw error; }
    });
  }

  private record(operation: string, channel: string, started: bigint, status: string) { const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000; telemetryRegistry.incrementCounter('nexora_redis_pubsub_operations_total', 1, { operation, channel, status }); telemetryRegistry.observeHistogram('nexora_redis_pubsub_operation_duration_ms', durationMs, { operation, channel, status }); }
}