'use client';

import { motion } from 'framer-motion';
import { Bell, Check, Layers3, Palette, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-states';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/toast';
import { ResponsiveGrid } from '@/components/layout/responsive-layout';
import { designSystem } from '@/lib/design-system';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { designTokens } from '@/styles/tokens';

const componentRows = [
  ['Button', 'Command surfaces, forms, shell controls', 'Ready'],
  ['Modal', 'Approvals, forms, confirmations', 'Ready'],
  ['Drawer', 'Side panels, inspectors, mobile overlays', 'Ready'],
  ['Toast', 'Realtime feedback and action states', 'Ready'],
];

export function DesignSystemWorkspace() {
  const pushToast = useToast((state) => state.push);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <ResponsiveGrid>
        {[
          { icon: Palette, label: 'Theme', value: 'Deep Graphite', detail: 'Luxury gold accents' },
          { icon: Layers3, label: 'Components', value: '14 primitives', detail: 'ShadCN-inspired API' },
          { icon: ShieldCheck, label: 'Accessibility', value: 'WCAG-ready', detail: 'Focus and motion controls' },
          { icon: Zap, label: 'Motion', value: 'Premium ease', detail: 'Reduced-motion aware' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} variants={staggerItem}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="grid size-10 place-items-center rounded-lg border border-gold-500/25 bg-gold-500/10 text-gold-300">
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="neutral">{item.label}</Badge>
                  </div>
                  <CardTitle>{item.value}</CardTitle>
                  <CardDescription>{item.detail}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </ResponsiveGrid>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>Core controls for enterprise workflows, command surfaces, and adaptive workspace generation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Button><Sparkles className="size-4" />Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Tooltip label="Icon button with accessible label">
                <Button variant="icon" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button>
              </Tooltip>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Workspace name" aria-label="Workspace name" />
              <Select aria-label="Theme mode" placeholder="Theme mode" options={[{ label: 'Deep Graphite', value: 'graphite' }, { label: 'Executive Light', value: 'light' }]} />
            </div>
            <Tabs
              items={[
                { value: 'tokens', label: 'Tokens', content: <TokenSwatches /> },
                { value: 'states', label: 'States', content: <StatePreview /> },
                { value: 'tables', label: 'Tables', content: <ComponentTable /> },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise Shell</CardTitle>
            <CardDescription>Adaptive navigation, workspace header, command palette, global search, notifications, and AI dock.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>NX</AvatarFallback></Avatar>
                <div>
                  <div className="text-sm font-semibold text-white">{designSystem.name}</div>
                  <div className="text-xs text-graphite-400">{designSystem.theme}</div>
                </div>
              </div>
            </div>
            <Modal
              title="Premium modal"
              description="Modal foundation for forms, approvals, and enterprise confirmations."
              trigger={<Button variant="outline" className="w-full">Open modal</Button>}
            >
              <div className="space-y-4">
                <Input placeholder="Approval reason" aria-label="Approval reason" />
                <Button className="w-full"><Check className="size-4" />Confirm</Button>
              </div>
            </Modal>
            <Drawer
              title="Inspector drawer"
              description="Drawer foundation for detail panels, filters, and AI summaries."
              trigger={<Button variant="subtle" className="w-full">Open drawer</Button>}
            >
              <div className="space-y-3 text-sm text-graphite-300">
                <p>Responsive side panels inherit shell spacing, motion, and focus states.</p>
                <LoadingState variant="ai" label="AI-ready panel state" />
              </div>
            </Drawer>
            <Button
              variant="gold"
              className="w-full"
              onClick={() => pushToast({ title: 'Design system event', description: 'Toast, shell, and provider wiring are active.', tone: 'success' })}
            >
              Trigger toast
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frontend Architecture Foundation</CardTitle>
          <CardDescription>Phase 51 prepares the application for Phase 52 authentication, welcome, and onboarding flows.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {['Tokenized Tailwind theme', 'Provider-driven shell', 'Responsive layout engine', 'Accessible overlays', 'Motion system', 'Component report coverage'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-graphite-200">
                <Check className="mb-3 size-4 text-gold-300" />
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TokenSwatches() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Object.entries(designTokens.colors.gold).slice(0, 4).map(([key, value]) => (
        <div key={key} className="rounded-md border border-white/10 p-2">
          <div className="h-10 rounded-sm" style={{ backgroundColor: value }} />
          <div className="mt-2 text-xs text-graphite-300">gold {key}</div>
        </div>
      ))}
    </div>
  );
}

function StatePreview() {
  return (
    <div className="space-y-3">
      <LoadingState label="Loading workflow state" />
      <LoadingState variant="pulse" label="Loading" />
      <div className="grid gap-2 md:grid-cols-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  );
}

function ComponentTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Use</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {componentRows.map(([component, use, status]) => (
          <TableRow key={component}>
            <TableCell className="font-medium text-white">{component}</TableCell>
            <TableCell>{use}</TableCell>
            <TableCell><Badge variant="success">{status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
