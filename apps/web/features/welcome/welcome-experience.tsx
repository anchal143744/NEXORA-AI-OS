'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Building2, CheckCircle2, KeyRound, Sparkles, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthLayout } from '@/features/auth/auth-layout';
import { staggerContainer, staggerItem } from '@/lib/motion';

const flow = [
  { icon: KeyRound, title: 'Authenticate', detail: 'Email, Google, Microsoft or enterprise SSO.' },
  { icon: Building2, title: 'Create organization', detail: 'Initialize tenant, business and workspace context.' },
  { icon: Wand2, title: 'Generate workspace', detail: 'AI maps modules, KPIs, workflows, roles and agents.' },
  { icon: Bot, title: 'Meet copilot', detail: 'First-time AI guidance starts with your business profile.' },
];

export function WelcomeExperience() {
  return (
    <AuthLayout mode="welcome">
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={staggerItem}>
          <Badge>Phase 52 Welcome Experience</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">Launch your adaptive AI business OS in one guided flow.</h2>
          <p className="mt-3 text-sm leading-7 text-graphite-300">
            NEXORA turns authentication, business setup, workspace intelligence, role assignment and AI onboarding into one premium first-run experience.
          </p>
        </motion.div>
        <motion.div variants={staggerItem} className="grid gap-3 sm:grid-cols-2">
          {flow.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="grid size-10 place-items-center rounded-lg border border-gold-500/25 bg-gold-500/10 text-gold-300">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.detail}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </motion.div>
        <motion.div variants={staggerItem}>
          <Card className="border-gold-500/20 bg-gold-500/10">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gold-100"><CheckCircle2 className="size-4" />Enterprise-ready start</div>
                <p className="mt-1 text-sm text-graphite-300">Begin with signup or sign in to continue onboarding.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild><Link href="/auth/signup">Start setup <ArrowRight className="size-4" /></Link></Button>
                <Button asChild variant="outline"><Link href="/auth/login">Sign in</Link></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
