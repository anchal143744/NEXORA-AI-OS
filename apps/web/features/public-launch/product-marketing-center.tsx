'use client';

import { Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { marketingMessages } from '@/lib/public-launch';
import { LaunchPanel } from './public-launch-panel';

export function ProductMarketingCenter() {
  return (
    <LaunchPanel title="Product Marketing Center" description="Positioning, Value Propositions, Industry Messaging and Competitive Differentiation for the public launch narrative." badge="Competitive Differentiation">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {marketingMessages.map((message) => (
          <article key={message.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <Megaphone className="size-5 text-gold-200" />
            <Badge className="mt-4">{message.area}</Badge>
            <h3 className="mt-3 font-semibold leading-6 text-white">{message.headline}</h3>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{message.proof}</p>
          </article>
        ))}
      </div>
    </LaunchPanel>
  );
}
