import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import { runTelemetryContext } from '../observability/request-telemetry-context';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextStore {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  run<T>(context: RequestContext, callback: () => T): T {
    return runTelemetryContext(context, () => this.storage.run(context, callback));
  }

  get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  requireTenantId(): string {
    const tenantId = this.get()?.tenantId;
    if (!tenantId) throw new Error('Tenant context is required');
    return tenantId;
  }
}