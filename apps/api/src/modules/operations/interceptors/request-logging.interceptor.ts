import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RequestContextStore } from '../../../common/context/request-context.store';
import { LoggingService } from '../observability/logging.service';
import { MetricsService } from '../observability/metrics.service';
import { TracingService } from '../observability/tracing.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService, private readonly metrics: MetricsService, private readonly tracing: TracingService, private readonly contextStore: RequestContextStore) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const req = context.switchToHttp().getRequest<Request & { auth?: { sub?: string; tenantId?: string } }>();
    const res = context.switchToHttp().getResponse<Response>();
    const requestContext = this.contextStore.get();
    const started = process.hrtime.bigint();
    const path = resolveRoutePath(req);
    const span = this.tracing.startSpan(`HTTP ${req.method} ${path}`, { kind: 'server', attributes: { 'http.method': req.method, 'http.route': path, 'http.target': req.originalUrl ?? req.url, 'net.peer.ip': req.ip, 'user_agent.original': req.headers['user-agent'] } });
    res.setHeader('traceparent', this.tracing.traceparent(span.traceId, span.spanId));

    return next.handle().pipe(
      tap(() => {
        const durationMs = durationSince(started); const statusCode = res.statusCode; const labels = this.httpLabels(req.method, path, statusCode, requestContext?.tenantId ?? req.auth?.tenantId);
        this.metrics.incrementCounter('nexora_http_requests_total', 1, labels); this.metrics.observeHistogram('nexora_http_request_duration_ms', durationMs, labels);
        this.tracing.finishSpan(span, statusCode >= 500 ? 'ERROR' : 'OK', { 'http.status_code': statusCode, durationMs });
        this.logger.log('http.request.completed', { method: req.method, path, statusCode, durationMs });
      }),
      catchError((error) => {
        const durationMs = durationSince(started); const statusCode = Number(error?.status ?? error?.statusCode ?? 500); const labels = this.httpLabels(req.method, path, statusCode, requestContext?.tenantId ?? req.auth?.tenantId);
        this.metrics.incrementCounter('nexora_http_requests_total', 1, labels); this.metrics.incrementCounter('nexora_http_errors_total', 1, labels); this.metrics.observeHistogram('nexora_http_request_duration_ms', durationMs, labels);
        this.tracing.finishSpan(span, 'ERROR', { 'http.status_code': statusCode, 'error.type': error?.name, 'error.message': error?.message, durationMs });
        this.logger.error('http.request.failed', error?.stack, { method: req.method, path, statusCode, durationMs, message: error?.message });
        return throwError(() => error);
      }),
    );
  }

  private httpLabels(method: string, path: string, statusCode: number, tenantId?: string) { return { method, path, status: String(statusCode), tenant_id: tenantId ?? 'public' }; }
}

function resolveRoutePath(req: Request) { const routePath = typeof req.route?.path === 'string' ? req.route.path : undefined; const baseUrl = req.baseUrl || ''; return routePath ? `${baseUrl}${routePath}` : String(req.originalUrl ?? req.url ?? '/').split('?')[0]; }
function durationSince(started: bigint) { return Number(process.hrtime.bigint() - started) / 1_000_000; }