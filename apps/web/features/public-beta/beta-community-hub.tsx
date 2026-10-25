'use client';

import { MessagesSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { communityThreads } from '@/lib/public-beta';
import { BetaPanel } from './public-beta-panel';

export function BetaCommunityHub() {
  return (
    <BetaPanel title="Beta Community Hub" description="Discussions, announcements, product updates and feedback threads help customer learning become launch intelligence." badge="Discussions">
      <div className="grid gap-3 lg:grid-cols-4">
        {communityThreads.map((thread) => (
          <article key={thread.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 font-semibold text-white"><MessagesSquare className="size-4 text-gold-200" />{thread.topic}</div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="neutral">{thread.replies} replies</Badge>
              <Badge variant="info">{thread.owner}</Badge>
            </div>
            <p className="mt-3 text-xs leading-5 text-gold-100">{thread.signal}</p>
          </article>
        ))}
      </div>
    </BetaPanel>
  );
}
