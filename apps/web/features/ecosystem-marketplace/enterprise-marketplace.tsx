'use client';

import { Search, Star, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { marketplaceCategories, marketplaceListings } from '@/lib/ecosystem-marketplace';
import { EcosystemPanel, StatusBadge } from './ecosystem-marketplace-panel';

export function EnterpriseMarketplace() {
  return (
    <EcosystemPanel title="Enterprise Marketplace" description="Marketplace Home, App Discovery, Category Management, Ratings & Reviews, Featured Apps and Marketplace Search in one premium buyer flow." badge="Marketplace Search">
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white"><Search className="size-4 text-gold-200" />Marketplace Search</div>
          {marketplaceCategories.map((category) => (
            <div key={category.id} className="rounded-lg border border-white/10 bg-graphite-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-white">{category.name}</div>
                <Badge variant="neutral">{category.appCount} apps</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-graphite-400">{category.description}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3">
          {marketplaceListings.map((listing) => (
            <article key={listing.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white"><Store className="size-4 text-gold-200" />{listing.name}</div>
                  <p className="mt-2 text-sm leading-6 text-graphite-300">{listing.summary}</p>
                </div>
                <StatusBadge status={listing.status} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-graphite-300">
                <Badge>{listing.category}</Badge>
                <span className="inline-flex items-center gap-1"><Star className="size-3 text-gold-200" />{listing.rating}</span>
                <span>{listing.installs} installs</span>
                <span>{listing.installTime}</span>
              </div>
              <Button className="mt-4" variant="gold">Install app</Button>
            </article>
          ))}
        </div>
      </div>
    </EcosystemPanel>
  );
}
