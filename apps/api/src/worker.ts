import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './modules/operations/observability/logging.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  app.enableShutdownHooks();
  logger.log('nexora.worker.started', { worker: 'production', queues: 'bullmq' });

  const shutdown = async (signal: string) => {
    logger.warn('nexora.worker.shutdown.requested', { signal });
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

void bootstrap();