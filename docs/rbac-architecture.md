# RBAC Architecture

## Roles

Implemented enterprise roles:

- Super Admin
- Organization Owner
- Admin
- Manager
- Team Lead
- Employee
- Viewer

Role constants live in `apps/api/src/modules/rbac/constants/roles.ts`.

## Permission Actions

Implemented permission actions:

- Create
- Read
- Update
- Delete
- Manage
- Approve
- Execute

Permission constants live in `apps/api/src/modules/rbac/constants/permissions.ts`.

## RBAC Components

- `RoleService`: seeds and manages tenant roles.
- `PermissionService`: seeds and manages resource permissions.
- `RequireRoles`: route metadata decorator.
- `RequirePermissions`: route metadata decorator.
- `RbacGuard`: checks route-level role and permission requirements.
- `PolicyGuard`: validates tenant-aware policy context.

## Tenant-Aware Authorization

All roles and permissions are tenant-scoped in the Prisma schema. Route guards read request roles and permissions from the authenticated/request context and enforce declared requirements.

## Future Hardening

Later phases should move request role/permission reads from headers to verified JWT/session-derived claims and database-backed policy evaluation.
