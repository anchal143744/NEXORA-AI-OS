'use client';

import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function CommandGlobalSearch() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-graphite-500" />
          <Input aria-label="Command center global search" className="pl-9" placeholder="Search workspaces, modules, KPIs, insights, activities and people" />
        </div>
      </CardContent>
    </Card>
  );
}
