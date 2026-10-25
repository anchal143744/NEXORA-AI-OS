import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { AppProviders } from '@/providers/app-providers';

export const metadata: Metadata = {
  title: {
    default: 'NEXORA · Retail workspace',
    template: '%s | NEXORA',
  },
  description: 'Customers, follow-ups, inventory, sales and clear financial reports in one retail workspace.',
  applicationName: 'NEXORA',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#070e1c',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-graphite-990">
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
