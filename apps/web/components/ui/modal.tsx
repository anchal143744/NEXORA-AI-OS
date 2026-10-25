'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { motionTokens } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Modal({
  trigger,
  title,
  description,
  children,
  className,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-graphite-990/70 backdrop-blur-md" />
        <Dialog.Content asChild>
          <motion.div
            {...motionTokens.modal}
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-graphite-950 p-6 text-graphite-50 shadow-glow',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">{title}</Dialog.Title>
                {description ? <Dialog.Description className="mt-1 text-sm leading-6 text-graphite-400">{description}</Dialog.Description> : null}
              </div>
              <Dialog.Close asChild>
                <Button variant="icon" size="icon" aria-label="Close modal">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
