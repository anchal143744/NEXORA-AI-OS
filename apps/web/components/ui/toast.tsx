'use client';

import { X } from 'lucide-react';
import { create } from 'zustand';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ToastTone = 'info' | 'success' | 'warning' | 'critical';

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
};

type ToastState = {
  toasts: ToastMessage[];
  push: (toast: Omit<ToastMessage, 'id'>) => void;
  remove: (id: string) => void;
};

const toneClass: Record<ToastTone, string> = {
  info: 'border-primary-300/25 bg-primary-300/10',
  success: 'border-emerald-300/25 bg-emerald-300/10',
  warning: 'border-amber-300/25 bg-amber-300/10',
  critical: 'border-red-300/25 bg-red-300/10',
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => {
      const nextToast: ToastMessage = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : 'toast-' + Date.now(),
        tone: 'info',
        ...toast,
      };

      return {
        toasts: [...state.toasts, nextToast].slice(-4),
      };
    }),
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export function ToastViewport() {
  const toasts = useToast((state) => state.toasts);
  const remove = useToast((state) => state.remove);

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-[70] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className={cn('rounded-lg border p-4 text-sm text-graphite-50 shadow-glow backdrop-blur-shell', toneClass[toast.tone ?? 'info'])}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-white">{toast.title}</div>
              {toast.description ? <div className="mt-1 leading-6 text-graphite-300">{toast.description}</div> : null}
            </div>
            <Button variant="icon" size="icon" className="size-8" onClick={() => remove(toast.id)} aria-label="Dismiss notification">
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
