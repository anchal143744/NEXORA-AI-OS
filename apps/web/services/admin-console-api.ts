export const adminConsoleApi = {
  overview: () => fetch('/api/v1/admin-center/overview'),
  organizations: () => fetch('/api/v1/admin-center/organizations'),
  workspaces: () => fetch('/api/v1/admin-center/workspaces'),
  users: () => fetch('/api/v1/admin-center/users'),
  subscriptions: () => fetch('/api/v1/admin-center/subscriptions'),
  aiUsage: () => fetch('/api/v1/admin-center/ai-usage'),
  importCsv: (payload: unknown) => fetch('/api/v1/data-import/csv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
  migrationAdapters: () => fetch('/api/v1/migrations/adapters'),
  startOnboarding: (payload: unknown) => fetch('/api/v1/customer-onboarding/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
};
