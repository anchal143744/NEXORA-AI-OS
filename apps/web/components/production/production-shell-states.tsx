import { Home, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { PremiumLoadingPanel } from '@/components/ui/production-states';

export function ProductionLoadingScreen() {
  return (
    <main className="min-h-screen bg-graphite-990 p-4 text-graphite-50 md:p-8" aria-busy="true">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <PremiumLoadingPanel label="Preparing the NEXORA operating workspace" />
      </section>
    </main>
  );
}

export function ProductionErrorScreen({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <main className="min-h-screen bg-graphite-990 p-4 text-graphite-50 md:p-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
        <ErrorState
          title={title}
          description={description}
          action={
            <div className="mt-4 flex flex-wrap gap-2">
              {onRetry ? (
                <Button type="button" variant="outline" onClick={onRetry}>
                  <RefreshCw className="size-4" />
                  Retry
                </Button>
              ) : null}
              <Button asChild>
                <Link href="/">
                  <Home className="size-4" />
                  Return home
                </Link>
              </Button>
            </div>
          }
        />
      </section>
    </main>
  );
}

export function ProductionNotFoundScreen() {
  return (
    <main className="min-h-screen bg-graphite-990 p-4 text-graphite-50 md:p-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-lg border border-gold-500/25 bg-gold-500/10 text-gold-100">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-white">Workspace route not found</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-graphite-400">
              The requested NEXORA route does not exist or is not enabled for this workspace configuration.
            </p>
            <Button asChild className="mt-6">
              <Link href="/workspace-launcher">Open workspace launcher</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
