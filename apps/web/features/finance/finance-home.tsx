'use client';

import { motion } from 'framer-motion';
import { Banknote, Brain, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { staggerItem } from '@/lib/motion';
import { useFinanceWorkspaceStore } from '@/stores/finance-workspace-store';

const icons = [TrendingUp, Banknote, FileText, Banknote, Brain];

export function FinanceHome() {
  const metrics = useFinanceWorkspaceStore((state) => state.metrics);
  const insights = useFinanceWorkspaceStore((state) => state.insights);
  return (
    <motion.div variants={staggerItem} className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <Badge><Sparkles className="size-3" />Finance Home</Badge>
          <CardTitle className="mt-2 text-xl">Executive-friendly finance without accounting clutter.</CardTitle>
          <CardDescription>Revenue, cash, invoices, expenses, budget health and AI guidance in one premium workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric, index) => {
            const Icon = icons[index] ?? Banknote;
            return (
              <article key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center justify-between">
                  <Icon className="size-4 text-gold-200" />
                  <Badge variant={metric.tone === 'healthy' ? 'success' : metric.tone === 'watch' ? 'warning' : 'neutral'}>{metric.trend}</Badge>
                </div>
                <div className="mt-4 text-2xl font-semibold text-white">{metric.value}</div>
                <div className="mt-1 text-sm text-graphite-300">{metric.label}</div>
                <div className="mt-2 text-xs leading-5 text-graphite-500">{metric.detail}</div>
              </article>
            );
          })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Prioritized finance signals for leaders and operators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <article key={insight.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold text-white">{insight.title}</div>
                <Badge variant={insight.severity === 'risk' ? 'warning' : insight.severity === 'opportunity' ? 'success' : 'info'}>{insight.severity}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-graphite-300">{insight.summary}</p>
            </article>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
