import { randomUUID } from 'node:crypto';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomSpanId, randomTraceId, tracingBackend } from '../observability/tracing-backend';
import { RequestContextStore } from '../context/request-context.store';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly contextStore: RequestContextStore) {}

  use(req: Request, res: Response, next: NextFunction) {
    const incomingTrace = tracingBackend.parseTraceparent(req.headers.traceparent);
    const requestId = firstHeader(req.headers['x-request-id']) ?? randomUUID();
    const correlationId = firstHeader(req.headers['x-correlation-id']) ?? requestId;
    const traceId = incomingTrace?.traceId ?? firstHeader(req.headers['x-trace-id']) ?? randomTraceId();
    const spanId = randomSpanId();
    const context = {
      requestId,
      correlationId,
      traceId,
      spanId,
      parentSpanId: incomingTrace?.parentSpanId,
      tenantId: (req.headers['x-tenant-id'] as string | undefined) ?? req.body?.tenantId,
      organizationId: req.headers['x-organization-id'] as string | undefined,
      workspaceId: req.headers['x-workspace-id'] as string | undefined,
      userId: undefined,
      roles: [],
      permissions: [],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
    res.setHeader('x-request-id', requestId);
    res.setHeader('x-correlation-id', correlationId);
    res.setHeader('traceparent', tracingBackend.traceparent(traceId, spanId));
    this.contextStore.run(context, next);
  }
}

function firstHeader(value: unknown): string | undefined {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : undefined;
  return value ? String(value) : undefined;
}
