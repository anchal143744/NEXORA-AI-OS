import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main id="main-content" className="min-h-screen bg-[#070e1c] px-4 py-6 text-[#eef2ff] [color-scheme:dark] [&_.animate-pulse]:bg-[#25334c] md:px-6" aria-busy="true" aria-label="Loading NEXORA workspace">
      <div className="page-shell space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-72 max-w-[72vw]" />
            <Skeleton className="h-4 w-96 max-w-[82vw]" />
          </div>
          <Skeleton className="hidden h-10 w-36 md:block" />
        </div>
        <div className="dashboard-grid">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </main>
  );
}
