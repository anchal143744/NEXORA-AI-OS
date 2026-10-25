import type { ReactNode } from 'react';

export function AuthLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-graphite-990 text-graphite-50 lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)]">
      <section className="hidden border-r border-white/10 bg-white/[0.035] p-8 lg:block">{aside}</section>
      <section className="grid place-items-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
