import { Injectable } from '@nestjs/common';
import { telemetryRegistry } from '../../../common/observability/telemetry-registry';
import { tracingBackend } from '../../../common/observability/tracing-backend';
import { RedisService } from '../redis.service';

export type CacheScope = 'dashboard' | 'workspace' | 'analytics' | 'ai-context' | 'user-session';

@Injectable()
export class RedisCacheService {
  constructor(private readonly redis: RedisService) {}
  key(scope: CacheScope, tenantId: string, id: string) { return `nexora:${scope}:tenant:${tenantId}:${id}`; }

  async get<T>(scope: CacheScope, tenantId: string, id: string): Promise<T | null> {
    const span = tracingBackend.startSpan('redis.cache.get', { kind: 'client', attributes: { scope } }); const started = process.hrtime.bigint();
    try { await this.redis.connect(); const value = await this.redis.client.get(this.key(scope, tenantId, id)); this.record('get', scope, started, value ? 'hit' : 'miss'); tracingBackend.finishSpan(span, 'OK', { cacheHit: Boolean(value), redisEnabled: this.redis.isEnabled() }); return value ? (JSON.parse(value) as T) : null; }
    catch (error) { this.record('get', scope, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); if (process.env.NODE_ENV === 'production') throw error; return null; }
  }

  async set(scope: CacheScope, tenantId: string, id: string, value: unknown, ttlSeconds = 300) {
    const span = tracingBackend.startSpan('redis.cache.set', { kind: 'client', attributes: { scope, ttlSeconds } }); const started = process.hrtime.bigint();
    try { await this.redis.connect(); await this.redis.client.set(this.key(scope, tenantId, id), JSON.stringify(value), 'EX', ttlSeconds); this.record('set', scope, started, this.redis.isEnabled() ? 'ok' : 'memory'); tracingBackend.finishSpan(span, 'OK', { redisEnabled: this.redis.isEnabled() }); }
    catch (error) { this.record('set', scope, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); if (process.env.NODE_ENV === 'production') throw error; }
  }

  async del(scope: CacheScope, tenantId: string, id: string) {
    const span = tracingBackend.startSpan('redis.cache.del', { kind: 'client', attributes: { scope } }); const started = process.hrtime.bigint();
    try { await this.redis.connect(); await this.redis.client.del(this.key(scope, tenantId, id)); this.record('del', scope, started, this.redis.isEnabled() ? 'ok' : 'memory'); tracingBackend.finishSpan(span, 'OK', { redisEnabled: this.redis.isEnabled() }); }
    catch (error) { this.record('del', scope, started, 'error'); tracingBackend.finishSpan(span, 'ERROR', { 'error.message': error instanceof Error ? error.message : 'unknown' }); if (process.env.NODE_ENV === 'production') throw error; }
  }

  private record(operation: string, scope: string, started: bigint, status: string) { const durationMs = Number(process.hrtime.bigint() - started) / 1_000_000; telemetryRegistry.incrementCounter('nexora_redis_cache_operations_total', 1, { operation, scope, status }); telemetryRegistry.observeHistogram('nexora_redis_cache_operation_duration_ms', durationMs, { operation, scope, status }); }
}