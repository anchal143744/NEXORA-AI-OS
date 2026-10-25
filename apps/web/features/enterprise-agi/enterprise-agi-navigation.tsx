import { Bot, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { enterpriseAgiNavigation } from '@/lib/enterprise-agi';

export function EnterpriseAgiNavigation() {
  return (
    <Card>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-2 xl:grid-cols-4">
        {enterpriseAgiNavigation.map((group) => (
          <div key={group.group} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <Badge><Bot className="size-3" />{group.group}</Badge>
            <div className="mt-4 space-y-2">
              {group.items.map((item) => (
                <div key={item} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-graphite-200">
                  <span>{item}</span>
                  <ChevronRight className="size-4 text-gold-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
