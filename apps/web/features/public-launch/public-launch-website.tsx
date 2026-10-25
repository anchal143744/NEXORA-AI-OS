'use client';

import { ArrowRight, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { publicWebsitePages } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function PublicLaunchWebsite({ activePage }: { activePage?: string }) {
  return (
    <LaunchPanel title="Public Launch Website" description="Home, Product, Solutions, Industries, Pricing, Security, Marketplace, Developers and Contact Sales pages for launch conversion." badge="Contact Sales">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {publicWebsitePages.map((page) => (
          <article key={page.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <Globe2 className="size-5 text-gold-200" />
              {activePage === page.id ? <Badge variant="success">active page</Badge> : <Badge variant="neutral">{page.path}</Badge>}
            </div>
            <h3 className="mt-4 font-semibold text-white">{page.label}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{page.promise}</p>
            <Button className="mt-4" variant="gold" size="sm">{page.primaryCta}<ArrowRight className="size-3" /></Button>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}

export function PublicLaunchWebsitePage({ activePage = 'home' }: { activePage?: string }) {
  const page = publicWebsitePages.find((item) => item.id === activePage) ?? publicWebsitePages[0];
  return (
    <main className="min-h-screen bg-graphite-990 px-4 py-6 text-white md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-subtle md:p-8">
          <Badge><Globe2 className="size-3" />NEXORA AI OS v2.0</Badge>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal md:text-6xl">{page.label === 'Product' ? 'Adaptive AI Business Operating System' : page.label}</h1>
          <p className="max-w-3xl text-sm leading-7 text-graphite-300 md:text-base">{page.promise}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="gold">{page.primaryCta}<ArrowRight className="size-4" /></Button>
            <Button variant="outline">View launch readiness</Button>
          </div>
        </div>
        <PublicLaunchWebsite activePage={activePage} />
      </section>
    </main>
  );
}
