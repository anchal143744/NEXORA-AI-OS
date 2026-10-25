import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';
import { telemetryRegistry } from '../../common/observability/telemetry-registry';
import { tracingBackend } from '../../common/observability/tracing-backend';
import { MemoryRedisClient } from './memory-redis-client';
import { REDIS_CONNECTION, type RedisConnection } from './redis.provider';

export type RedisRuntimeClient = Redis | MemoryRedisClient;

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly fallbackClient = new MemoryRedisClient();
  private readonly fallbackPublisher = new MemoryRedisClient();
  private readonly fallbackSubscriber = new MemoryRedisClient();

  constructor(@Inject(REDIS_CONNECTION) private readonly connection: RedisConnection | null) {}

  get client(): RedisRuntimeClient {
    return this.connection?.client ?? this.fallbackClient;
  }

  get publisher(): RedisRuntimeClient {
    return this.connection?.publisher ?? this.fallbackPublisher;
  }

  get subscriber(): RedisRuntimeClient {
    return this.connection?.subscriber ?? this.fallbackSubscriber;
  }

  isEnabled() {
    return Boolean(this.connection);
  }

  async connect() {
    const span = tracingBackend.startSpan('redis.connect', { kind: 'client' });
    const started = process.hrtime.bigint();
    if (!this.connection) {
      this.record('connect', started, 'disabled');
      tracingBackend.finishSpan(span, 'OK', { disabled: true });
      return false;
    }

    try {
      await Promise.all([this.ensureConnected(this.connection.client), this.ensureConnected(this.connection.publisher), this.ensureConnected(this.connection.subscriber)]);
      this.record('connect', started, 'ok');
      tracingBackend.finishSpan(span, 'OK');
      return true;
    } catch (error) {
      this.record('connect', started, 'error');
      tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' });
      throw error;
    }
  }

  async onModuleDestroy() {
    await Promise.allSettled([this.client.quit(), this.publisher.quit(), this.subscriber.quit()]);
  }

  private async ensureConnected(client: Redis) {
    if (client.status === 'wait' || client.status === 'end') await client.connect();
  }

  private record(operation: string, started: bigint, status: 'ok' | 'error' | 'disabled') {
    const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000;
    telemetryRegistry.incrementCounter('nexora_redis_operations_total', 1, { operation, status });
    telemetryRegistry.observeHistogram('nexora_redis_operation_duration_ms', durationMs, { operation, status });
  }
}