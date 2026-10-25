'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Drawer({
  trigger,
  title,
  description,
  children,
  side = 'right',
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  side?: 'left' | 'right';
}) {
  const placement = side === 'right' ? 'right-0' : 'left-0';
  const initialX = side === 'right' ? 28 : -28;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-graphite-990/68 backdrop-blur-md" />
        <Dialog.Content asChild>
          <motion.aside
            initial={{ opacity: 0, x: initialX }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: initialX }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn('fixed top-0 z-50 h-dvh w-[min(420px,calc(100vw-1rem))] border-white/10 bg-graphite-950 p-5 text-graphite-50 shadow-shell', placement, side === 'right' ? 'border-l' : 'border-r')}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
                {description ? <Dialog.Description className="mt-1 text-sm leading-6 text-graphite-400">{description}</Dialog.Description> : null}
              </div>
              <Dialog.Close asChild>
                <Button variant="icon" size="icon" aria-label="Close drawer">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            <div className="mt-6">{children}</div>
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
