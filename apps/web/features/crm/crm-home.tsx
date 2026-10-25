'use client';

import { motion } from 'framer-motion';
import { DollarSign, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { staggerItem } from '@/lib/motion';
import { currency } from '@/lib/crm-workspace';
import { useCrmWorkspaceStore } from '@/stores/crm-workspace-store';

const icons = [DollarSign, Target, TrendingUp, Sparkles];

export function CrmHome() {
  const metrics = useCrmWorkspaceStore((state) => state.metrics);
  const insights = useCrmWorkspaceStore((state) => state.insights);
  const activities = useCrmWorkspaceStore((state) => state.activities);
  const opportunities = useCrmWorkspaceStore((state) => state.opportunities);
  const openValue = opportunities.filter((item) => !['closed_won', 'closed_lost'].includes(item.stage)).reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div variants={staggerItem} className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <Badge><Sparkles className="size-3" />CRM Home</Badge>
          <CardTitle className="text-xl">Revenue cockpit for pipeline, customers and AI next actions.</CardTitle>
          <CardDescription>Live CRM overview with pipeline value, open opportunities, forecast revenue, insights and recent activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => {
              const Icon = icons[index] ?? TrendingUp;
              return (
                <div key={metric.id} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="size-4 text-gold-200" />
                    <Badge variant={metric.tone === 'healthy' ? 'success' : metric.tone === 'watch' ? 'warning' : 'neutral'}>{metric.trend}</Badge>
                  </div>
                  <div className="mt-4 text-2xl font-semibold text-white">{metric.value}</div>
                  <div className="mt-1 text-sm text-graphite-300">{metric.label}</div>
                  <div className="mt-2 text-xs leading-5 text-graphite-500">{metric.detail}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-gold-500/20 bg-gold-500/10 p-4">
            <div className="text-sm font-semibold text-gold-100">Open pipeline signal</div>
            <div className="mt-1 text-sm leading-6 text-graphite-200">{currency(openValue)} is active across enterprise opportunities. AI recommends focusing on proposal approvals and negotiation blockers first.</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Insights and Recent Activities</CardTitle>
          <CardDescription>Prioritized signals for the sales operating rhythm.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.slice(0, 2).map((insight) => (
            <div key={insight.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{insight.title}</div>
                <Badge variant={insight.severity === 'risk' ? 'warning' : insight.severity === 'opportunity' ? 'success' : 'info'}>{insight.severity}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-graphite-300">{insight.summary}</p>
            </div>
          ))}
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <div>
                <div className="text-sm text-white">{activity.title}</div>
                <div className="mt-1 text-xs text-graphite-400">{activity.accountName} - {activity.owner}</div>
              </div>
              <span className="shrink-0 text-xs text-gold-100">{activity.due}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
