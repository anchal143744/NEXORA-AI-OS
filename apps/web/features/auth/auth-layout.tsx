'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Building2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motionTokens } from '@/lib/motion';

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset' | 'verify' | 'welcome';

const trustItems = [
  { icon: ShieldCheck, label: 'Secure organization access' },
  { icon: LockKeyhole, label: 'Trusted device sessions' },
  { icon: Building2, label: 'Guided workspace setup' },
];

const authCopy: Record<AuthMode, { badge: string; title: string; description: string }> = {
  login: {
    badge: 'Welcome back',
    title: 'Return to the workspace that understands your business.',
    description: 'Sign in to continue with secure sessions, workspace context and role-based access.',
  },
  signup: {
    badge: 'Create account',
    title: 'Start your AI business operating workspace.',
    description: 'Create the first owner account, organization and secure workspace foundation.',
  },
  forgot: {
    badge: 'Account recovery',
    title: 'Recover access without weakening security.',
    description: 'Request a secure reset link and return to your workspace with confidence.',
  },
  reset: {
    badge: 'Secure reset',
    title: 'Set a new password and protect your sessions.',
    description: 'NEXORA resets your credential through a verified reset token.',
  },
  verify: {
    badge: 'Email verification',
    title: 'Verify your email to protect the workspace.',
    description: 'Use the verification token from your email or request a fresh message.',
  },
  welcome: {
    badge: 'Welcome',
    title: 'Set up the first workspace with guided AI help.',
    description: 'Authentication, organization setup, AI preferences, roles, invites and workspace generation are one guided flow.',
  },
};

export function AuthLayout({ children, mode }: { children: ReactNode; mode: AuthMode }) {
  const copy = authCopy[mode];

  return (
    <main className="min-h-screen bg-graphite-990 text-graphite-50">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative flex min-h-[44vh] flex-col justify-between overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_24%_16%,rgba(216,180,93,0.18),transparent_28rem),radial-gradient(circle_at_82%_10%,rgba(78,142,162,0.18),transparent_30rem),linear-gradient(135deg,#05070B_0%,#0B1220_42%,#001D39_100%)] p-6 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-10">
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:premium-focus">
              <div className="grid size-10 place-items-center rounded-lg bg-gold-500 text-graphite-990 shadow-gold">
                <Sparkles className="size-4" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">NEXORA AI OS</div>
                <div className="text-xs text-graphite-400">Adaptive business operating system</div>
              </div>
            </Link>
            <motion.div {...motionTokens.page} className="mt-16 max-w-2xl">
              <Badge>{copy.badge}</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-normal text-white md:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-graphite-300">
                {copy.description}
              </p>
            </motion.div>
          </div>
          <div className="relative z-10 mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <Icon className="mb-3 size-4 text-gold-300" aria-hidden="true" />
                  <div className="text-sm text-graphite-200">{item.label}</div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
