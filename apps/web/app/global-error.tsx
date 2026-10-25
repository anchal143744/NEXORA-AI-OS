'use client';

import { useMemo } from 'react';
import '@/styles/globals.css';
import { ProductionErrorScreen } from '@/components/production/production-shell-states';
import { classifyFrontendError } from '@/lib/frontend-error-handling';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const state = useMemo(() => classifyFrontendError(error), [error]);

  return (
    <html lang="en">
      <body>
        <ProductionErrorScreen
          title={state.title}
          description={state.description}
          onRetry={state.retryable ? reset : undefined}
        />
      </body>
    </html>
  );
}
