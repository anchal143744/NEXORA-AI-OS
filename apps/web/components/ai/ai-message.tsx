import type { ReactNode } from 'react';
import { AiAvatar } from './ai-avatar';
import { cn } from '@/lib/utils';

export function AiMessage({
  role = 'assistant',
  title,
  children,
  className,
}: {
  role?: 'assistant' | 'user' | 'system';
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const isUser = role === 'user';

  return (
    <article className={cn('flex gap-3 rounded-lg border p-4', isUser ? 'border-primary-300/20 bg-primary-300/10' : 'border-gold-500/20 bg-gold-500/10', className)}>
      {!isUser ? <AiAvatar /> : null}
      <div className="min-w-0 flex-1">
        {title ? <h3 className="text-sm font-semibold text-white">{title}</h3> : null}
        <div className="mt-1 text-sm leading-6 text-graphite-200">{children}</div>
      </div>
    </article>
  );
}
