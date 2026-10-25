import { Global, Module } from '@nestjs/common';
import { RedisCacheService } from './cache/redis-cache.service';
import { RedisPubSubService } from './pubsub/redis-pubsub.service';
import { RedisEventTransportService } from './pubsub/redis-event-transport.service';
import { RedisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisProvider, RedisService, RedisCacheService, RedisPubSubService, RedisEventTransportService],
  exports: [RedisProvider, RedisService, RedisCacheService, RedisPubSubService, RedisEventTransportService],
})
export class RedisModule {}