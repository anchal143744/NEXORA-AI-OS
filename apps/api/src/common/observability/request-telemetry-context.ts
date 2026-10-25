import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContext } from '../context/request-context';

const telemetryContext = new AsyncLocalStorage<RequestContext>();

export function runTelemetryContext<T>(context: RequestContext, callback: () => T): T {
  return telemetryContext.run(context, callback);
}

export function getTelemetryContext(): RequestContext | undefined {
  return telemetryContext.getStore();
}