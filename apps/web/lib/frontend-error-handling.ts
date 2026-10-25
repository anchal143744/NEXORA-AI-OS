import { ApiClientError } from '@/lib/api-client';

export type FrontendErrorKind = 'api' | 'network' | 'unauthorized' | 'session-expired' | 'unexpected';

export type FrontendErrorState = {
  kind: FrontendErrorKind;
  title: string;
  description: string;
  retryable: boolean;
};

export function classifyFrontendError(error: unknown): FrontendErrorState {
  if (error instanceof ApiClientError) {
    if (error.status === 401) {
      return {
        kind: 'unauthorized',
        title: 'Session authorization required',
        description: 'Your session could not access this workspace action. Sign in again or request the required permission.',
        retryable: false,
      };
    }

    if (error.status === 419 || error.status === 440) {
      return {
        kind: 'session-expired',
        title: 'Session expired',
        description: 'Your secure session expired. Refresh the page and sign in again to continue.',
        retryable: false,
      };
    }

    return {
      kind: 'api',
      title: 'Service request failed',
      description: error.message || 'The backend returned an error while processing this request.',
      retryable: true,
    };
  }

  if (error instanceof TypeError) {
    return {
      kind: 'network',
      title: 'Network connection issue',
      description: 'NEXORA could not reach the service endpoint. Check connectivity and retry.',
      retryable: true,
    };
  }

  return {
    kind: 'unexpected',
    title: 'Unexpected application issue',
    description: 'The workspace encountered an unexpected rendering issue. Retry the action or reload the page.',
    retryable: true,
  };
}
