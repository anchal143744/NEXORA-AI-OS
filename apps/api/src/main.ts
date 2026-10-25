import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { LoggingService } from './modules/operations/observability/logging.service';
import { SecurityHardeningService } from './modules/operations/security/security-hardening.service';
import {desktopRetailBoundary} from './common/middleware/desktop-retail-boundary';
import {desktopCorsOrigins} from './common/middleware/desktop-cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(LoggingService);
  const security = app.get(SecurityHardeningService);
  app.useLogger(logger);
  app.enableShutdownHooks();
  if(process.env.NEXORA_LOCAL_DESKTOP==='true')process.on('message',message=>{
    if(!process.connected||!message||typeof message!=='object'||!('type' in message)||message.type!=='nexora:shutdown')return;
    void app.close().then(()=>process.exit(0)).catch(()=>process.exit(1));
  });

  app.use(helmet({ contentSecurityPolicy: { directives: security.csp() }, referrerPolicy: { policy: 'no-referrer' }, hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true }, frameguard: { action: 'deny' }, noSniff: true }));
  app.enableCors({ origin: resolveAllowedOrigins(), credentials: true, methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['authorization', 'content-type', 'x-api-key', 'x-request-id', 'x-correlation-id', 'x-tenant-id', 'x-organization-id', 'x-workspace-id', 'traceparent'] });
  if(process.env.NEXORA_LOCAL_DESKTOP==='true') app.use(desktopRetailBoundary);
  app.use('/api/v1/retail/shop/documents',json({limit:'7mb'}));
  app.use(json({ limit: process.env.API_PAYLOAD_LIMIT ?? '1mb' }));
  app.use(urlencoded({ extended: true, limit: process.env.API_PAYLOAD_LIMIT ?? '1mb' }));
  app.use(cookieParser());

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NEXORA AI API')
    .setDescription('Enterprise backend API foundation for NEXORA AI')
    .setVersion(process.env.npm_package_version ?? '3.1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
  const environment = process.env.NODE_ENV ?? 'development';
  if (environment !== 'production') logger.warn('Development Mode', { redis: 'optional', queues: 'optional' });
  if (process.env.NEXORA_LOCAL_DESKTOP === 'true') await app.listen(port, '127.0.0.1');
  else await app.listen(port);
  logger.log('Application Ready', { port, environment });
  logger.log('nexora.api.started', { port, environment });
}

function resolveAllowedOrigins() {
  if(process.env.NEXORA_LOCAL_DESKTOP==='true') return desktopCorsOrigins(process.env.NEXORA_WEB_PORT);
  const raw = process.env.CORS_ORIGINS ?? process.env.ALLOWED_ORIGINS ?? '';
  if (!raw && process.env.NODE_ENV !== 'production') return true;
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}

void bootstrap();
