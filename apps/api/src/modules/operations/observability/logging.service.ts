import { Injectable, LoggerService } from '@nestjs/common';
import { RequestContextStore } from '../../../common/context/request-context.store';
import { getTelemetryContext } from '../../../common/observability/request-telemetry-context';
import { redactSensitive } from '../../../common/observability/redaction.util';

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
type LogContext = Record<string, unknown> | string | undefined;

@Injectable()
export class LoggingService implements LoggerService {
  constructor(private readonly contextStore: RequestContextStore) {}
  log(message: string, context?: LogContext) { this.write('log', message, context); }
  error(message: string, trace?: string, context?: LogContext) { this.write('error', message, context, trace); }
  warn(message: string, context?: LogContext) { this.write('warn', message, context); }
  debug(message: string, context?: LogContext) { this.write('debug', message, context); }
  verbose(message: string, context?: LogContext) { this.write('verbose', message, context); }

  private write(level: LogLevel, message: string, context?: LogContext, trace?: string) {
    const activeContext = this.contextStore.get() ?? getTelemetryContext();
    const normalizedContext = typeof context === 'string' ? { loggerContext: context } : context;
    const entry = redactSensitive({ timestamp: new Date().toISOString(), level: level === 'log' ? 'info' : level, message, service: process.env.OTEL_SERVICE_NAME ?? 'nexora-api', environment: process.env.NODE_ENV ?? 'development', requestId: activeContext?.requestId, correlationId: activeContext?.correlationId, traceId: activeContext?.traceId, spanId: activeContext?.spanId, tenantId: activeContext?.tenantId, workspaceId: activeContext?.workspaceId, userId: activeContext?.userId, context: normalizedContext, trace });
    const line = `${JSON.stringify(entry)}\n`;
    if (level === 'error' || level === 'warn') process.stderr.write(line); else process.stdout.write(line);
  }
}