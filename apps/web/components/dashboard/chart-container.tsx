import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function ChartContainer({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm leading-6 text-graphite-400">{description}</p> : null}
      </CardHeader>
      <CardContent className="min-h-64">{children}</CardContent>
    </Card>
  );
}
