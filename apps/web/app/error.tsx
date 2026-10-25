'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="grid min-h-screen place-items-center bg-[#070e1c] px-4 py-10 text-[#eef2ff] [color-scheme:dark]">
      <Card className="w-full max-w-xl border-[#25334c] bg-[#101b2e] text-[#eef2ff] shadow-sm">
        <CardHeader>
          <div className="mb-3 inline-flex size-11 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-200">
            <AlertTriangle className="size-5" />
          </div>
          <CardTitle className="text-[#eef2ff]">Something needs attention</CardTitle>
          <p className="text-sm leading-6 text-[#9eacc8]">
            The workspace could not finish loading. Try again, or return after the current request completes.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-[#25334c] bg-[#070e1c] p-3 text-xs leading-5 text-[#9eacc8]">
            {error.digest ? `Reference: ${error.digest}` : 'If this continues, return home and sign in again.'}
          </div>
          <Button className="bg-[#9eacc8] text-white hover:bg-[#4631eb]" onClick={reset}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
