'use client';

import { Laptop, LogOut, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/services/auth-api';
import { useAuthStore } from '@/stores/auth-store';

export function SessionManagementPanel() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>Frontend controls for refresh, trusted device context and logout.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Button variant="subtle" onClick={() => authApi.refresh()}><RefreshCcw className="size-4" />Refresh</Button>
        <Button variant="subtle"><Laptop className="size-4" />Device context</Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await authApi.logout();
            } finally {
              clearSession();
            }
          }}
        >
          <LogOut className="size-4" />Logout
        </Button>
      </CardContent>
    </Card>
  );
}
