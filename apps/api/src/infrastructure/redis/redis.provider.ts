import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CONNECTION = Symbol('NEXORA_REDIS_CONNECTION');

export type RedisClient = Redis;
export type RedisConnection = {
  client: RedisClient;
  publisher: RedisClient;
  subscriber: RedisClient;
  url: string;
  enabled: true;
};

const logger = new Logger('RedisProvider');

export const RedisProvider: Provider<RedisConnection | null> = {
  provide: REDIS_CONNECTION,
  useFactory: async () => createRedisConnection(),
};

export function isProductionRuntime() {
  return process.env.NODE_ENV === 'production';
}

async function createRedisConnection(): Promise<RedisConnection | null> {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const production = isProductionRuntime();
  const options = {
    lazyConnect: true,
    maxRetriesPerRequest: production ? 3 : 0,
    enableOfflineQueue: production,
    connectTimeout: production ? 10_000 : 1_000,
    retryStrategy: production ? undefined : (() => null),
  } as const;

  const connection: RedisConnection = {
    client: new Redis(url, options),
    publisher: new Redis(url, options),
    subscriber: new Redis(url, options),
    url,
    enabled: true,
  };
  attachRedisErrorListeners(connection, production);

  try {
    await Promise.all([connection.client.connect(), connection.publisher.connect(), connection.subscriber.connect()]);
    await connection.client.ping();
    logger.log(`[Redis Enabled] Connected to ${redactRedisUrl(url)}.`);
    return connection;
  } catch (error) {
    await Promise.allSettled([connection.client.disconnect(), connection.publisher.disconnect(), connection.subscriber.disconnect()]);

    if (production) {
      logger.error('[Redis Required] Production startup failed because Redis is unavailable.', error instanceof Error ? error.stack : undefined);
      throw error;
    }

    logger.warn('[Redis Disabled] Running Development Mode.');
    logger.warn(error instanceof Error ? error.message : String(error));
    return null;
  }
}

function redactRedisUrl(url: string) {
  return url.replace(/:\/\/([^:@]+):([^@]+)@/, '://$1:***@');
}

function attachRedisErrorListeners(connection: RedisConnection, production: boolean) {
  let reported = false;
  const handleError = (clientName: string) => (error: unknown) => {
    if (!production) {
      return;
    }

    if (!reported) {
      reported = true;
      logger.error(
        `[Redis Required] ${clientName} connection error.`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  };

  connection.client.on('error', handleError('client'));
  connection.publisher.on('error', handleError('publisher'));
  connection.subscriber.on('error', handleError('subscriber'));
}
