'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboards, kpis, trends } from '@/lib/analytics-workspace';

const gold = '#D8B76A';
const blue = '#7BBDE8';
const teal = '#4E8EA2';
const graphite = '#6B7280';

function ChartFrame({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const updateReadiness = () => {
      const rect = element.getBoundingClientRect();
      setIsReady(rect.width > 0 && rect.height > 0);
    };

    updateReadiness();
    const observer = new ResizeObserver(updateReadiness);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="relative h-72 w-full min-w-0 overflow-hidden">
      {isReady ? children : <div className="flex h-full w-full items-center justify-center rounded-lg border border-white/10 bg-graphite-950/50 text-xs text-graphite-400">Preparing executive visualization</div>}
    </div>
  );
}

export function ExecutiveTrendChart() {
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={trends} margin={{ left: -12, right: 12, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={gold} stopOpacity={0.4} />
              <stop offset="95%" stopColor={gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="period" stroke={graphite} tickLine={false} axisLine={false} />
          <YAxis stroke={graphite} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff' }} />
          <Area type="monotone" dataKey="revenue" stroke={gold} fill="url(#revenueFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ModuleHealthChart() {
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={dashboards} margin={{ left: -12, right: 12, top: 12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="domain" stroke={graphite} tickLine={false} axisLine={false} />
          <YAxis stroke={graphite} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff' }} />
          <Bar dataKey="health" fill={blue} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function KpiPortfolioChart() {
  const colors = [gold, blue, teal, '#6EA2B3', '#BDD8E9'];
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <PieChart>
          <Tooltip contentStyle={{ background: '#0B1220', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff' }} />
          <Pie data={kpis} dataKey="current" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
            {kpis.map((item, index) => (
              <Cell key={item.id} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
