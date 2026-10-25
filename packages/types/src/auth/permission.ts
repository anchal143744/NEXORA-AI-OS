export interface PermissionContract {
  resource: string;
  action: string;
  scope: 'tenant' | 'organization' | 'workspace' | 'own';
  effect: 'allow' | 'deny';
}
