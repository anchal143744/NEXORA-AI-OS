'use client';

import Link from 'next/link';
import { Bot, Building2, CheckCircle2, KeyRound, LockKeyhole, RotateCw, Settings2, ShieldCheck, UserRound } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-states';
import { useAccountProfile } from '@/hooks/use-account-profile';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useWorkspace } from '@/providers/workspace-provider';
import { useAuthStore } from '@/stores/auth-store';

export function V1SettingsWorkspace() {
  const workspace = useWorkspace();
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const storedUser = useAuthStore((state) => state.user);
  const session = useAuthStore((state) => state.session);
  const profileQuery = useAccountProfile();
  const profile = profileQuery.data ?? storedUser;
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');
  const enabledModules = workspace.modules.filter((module) => module.enabled);

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-primary-500/[0.08] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Badge>
                <Settings2 className="size-3" />
                V1 Settings
              </Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Account, session and workspace context.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">
                Settings shows the authenticated profile and generated workspace context that the backend recognizes for protected V1 workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/onboarding">
                  <Building2 className="size-4" />
                  Update setup
                </Link>
              </Button>
              <Button asChild>
                <Link href="/ai">
                  <Bot className="size-4" />
                  Ask AI
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {isSessionLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Restoring authenticated settings session" />
            </CardContent>
          </Card>
        ) : null}

        {hydrated && authStatus === 'anonymous' ? (
          <ErrorState title="Sign in required" description="Settings are protected account data. Sign in before opening this V1 module." />
        ) : null}

        {profileQuery.isLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Loading account profile" />
            </CardContent>
          </Card>
        ) : null}

        {profileQuery.isError ? (
          <ErrorState
            title="Profile could not load"
            description={profileQuery.error.message}
            actionLabel="Retry profile"
            onAction={() => void profileQuery.refetch()}
          />
        ) : null}

        {profile ? (
          <>
            <div className="grid gap-3 md:grid-cols-4">
              <StatusMetric label="Account" value="Active" />
              <StatusMetric label="Roles" value={String(profile.roles.length)} />
              <StatusMetric label="Workspace" value={session?.workspaceId ? 'Linked' : 'Pending'} />
              <StatusMetric label="Email" value={profile.emailVerified ? 'Verified' : 'Unverified'} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="size-4 text-gold-100" />
                    Profile
                  </CardTitle>
                  <CardDescription>Loaded from the authenticated backend profile endpoint.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SettingRow label="Name" value={profile.name} />
                  <SettingRow label="Email" value={profile.email} />
                  <SettingRow label="User ID" value={profile.id} />
                  <SettingRow label="Tenant ID" value={profile.tenantId ?? session?.tenantId ?? 'Not linked'} />
                  <SettingRow label="Organization ID" value={profile.organizationId ?? session?.organizationId ?? 'Not linked'} />
                  <SettingRow label="Workspace ID" value={profile.workspaceId ?? session?.workspaceId ?? 'Not linked'} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="size-4 text-gold-100" />
                    Session security
                  </CardTitle>
                  <CardDescription>Secrets are never displayed in the browser UI.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SettingRow label="Access token" value={session?.accessToken ? 'Stored securely in the active browser session' : 'Not available'} />
                  <SettingRow label="Refresh token" value={session?.refreshToken ? 'Available for session refresh' : 'Not available'} />
                  <SettingRow label="Expires at" value={session?.expiresAt ?? 'Backend did not return an expiry'} />
                  <SettingRow label="Device ID" value={session?.deviceId ?? 'Not provided'} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-4 text-gold-100" />
                    Workspace context
                  </CardTitle>
                  <CardDescription>Generated workspace configuration used by navigation and dashboards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SettingRow label="Organization" value={workspace.organizationName} />
                  <SettingRow label="Workspace" value={workspace.workspaceName} />
                  <SettingRow label="Industry" value={workspace.industry} />
                  <SettingRow label="Currency" value={workspace.currency} />
                  <SettingRow label="Timezone" value={workspace.timezone} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-gold-100" />
                    Access model
                  </CardTitle>
                  <CardDescription>Frontend visibility mirrors backend-enforced RBAC; backend remains authoritative.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role) => <Badge key={role} variant="success"><CheckCircle2 className="size-3" />{role}</Badge>)}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {workspace.permissions.map((permission) => <SettingRow key={permission} label={permission} value="Visible" />)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="size-4 text-gold-100" />
                  V1 module visibility
                </CardTitle>
                <CardDescription>Enabled modules are resolved from the current workspace configuration.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {enabledModules.map((module) => <Badge key={module.key} variant="neutral">{module.label}</Badge>)}
                </div>
              </CardContent>
            </Card>

            <Alert title="Settings V1 boundary" variant="info">
              Direct organization, role, integration and security-policy editing APIs are not exposed as verified V1 frontend workflows yet, so this page does not show fake save controls.
            </Alert>
          </>
        ) : null}
      </div>
    </EnterpriseShell>
  );
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
      <span className="shrink-0 text-graphite-400">{label}</span>
      <span className="truncate text-right font-medium text-white">{value}</span>
    </div>
  );
}
