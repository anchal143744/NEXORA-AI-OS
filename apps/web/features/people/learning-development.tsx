'use client';

import { BookOpen, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeopleWorkspaceStore } from '@/stores/people-workspace-store';

export function LearningDevelopment() {
  const learning = usePeopleWorkspaceStore((state) => state.learning);
  return (
    <Card>
      <CardHeader>
        <Badge><GraduationCap className="size-3" />Learning and Development</Badge>
        <CardTitle className="mt-2">Courses, training programs, certifications and learning progress.</CardTitle>
        <CardDescription>Simple learning paths tied to skills and workforce readiness.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-4">
        {learning.map((item) => (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <BookOpen className="size-4 text-gold-200" />
            <div className="mt-3 text-sm font-semibold text-white">{item.title}</div>
            <div className="mt-1 text-xs text-graphite-400">{item.audience} - {item.owner}</div>
            <Badge className="mt-3" variant="neutral">{item.type}</Badge>
            <div className="mt-4 h-2 rounded-full bg-white/[0.08]">
              <div className="h-2 rounded-full bg-gold-400" style={{ width: String(item.completion) + '%' }} />
            </div>
            <div className="mt-2 text-xs text-graphite-400">{item.completion}% complete</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
