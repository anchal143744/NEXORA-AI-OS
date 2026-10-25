import { SetMetadata } from '@nestjs/common';
import { RoleKey } from '../constants/roles';

export const RBAC_ROLES_KEY = 'rbac:roles';
export const RequireRoles = (...roles: RoleKey[]) => SetMetadata(RBAC_ROLES_KEY, roles);
