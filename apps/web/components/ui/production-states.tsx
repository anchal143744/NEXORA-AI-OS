import { AlertCircle, Inbox, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PremiumEmptyState({ title, description, action }: { title: string; description: string; action: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="grid size-12 place-items-center rounded-lg border border-gold-500/25 bg-gold-500/10 text-gold-100">
          <Inbox className="size-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-graphite-400">{description}</p>
        <Button className="mt-5" size="sm"><Sparkles className="size-4" />{action}</Button>
      </CardContent>
    </Card>
  );
}

export function PremiumErrorState({ title, description, action }: { title: string; description: string; action: string }) {
  return (
    <Card className="border-amber-400/20 bg-amber-400/8">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-200" />
            <div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-graphite-300">{description}</p>
            </div>
          </div>
          <Button size="sm" variant="secondary"><RefreshCw className="size-4" />{action}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PremiumLoadingPanel({ label = 'Preparing release candidate' }: { label?: string }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm text-graphite-300" role="status" aria-label={label}>
          <Loader2 className="size-4 animate-spin text-gold-300" />
          <span>{label}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </CardContent>
    </Card>
  );
}
