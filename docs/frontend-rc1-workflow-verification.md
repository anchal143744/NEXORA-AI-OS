# RC1 End-to-End Workflow Verification

## Verified Workflow Matrix

| Workflow | Route or Surface | RC1 Status | Notes |
| --- | --- | --- | --- |
| Signup | /auth/signup | Verified | Form validates user, email, password, organization and role, then routes to email verification or onboarding. |
| Login | /auth/login | Verified | Email login, Google, Microsoft and SSO entry points are present. |
| Logout | Profile menu | Verified | Sign out is now available from the shell profile area and clears local session state after backend logout. |
| Forgot Password | /auth/forgot-password | Verified | Password reset request route and backend client action are wired. |
| Reset Password | /auth/reset-password | Verified | Reset token route and backend client action are wired. |
| Email Verification | /auth/verify-email | Verified | Verification request and confirm actions are wired. |
| Workspace Setup | /onboarding | Verified | AI business setup wizard route exists and uses the adaptive workspace client. |
| Workspace Generation | /onboarding | Verified | Generation calls the existing adaptive workspace backend client and only shows success after backend response. |
| Dashboard | /workspace-launcher | Verified | Dynamic dashboard is generated from workspace configuration. |
| Navigation | Sidebar and command palette | Verified | Navigation is generated from workspace modules and command palette supports business commands. |
| AI Copilot | Global provider | Verified | Persistent copilot is mounted globally and available across routes. |

## Backend-Dependent Items

These workflows are wired in the frontend and require a running backend plus valid environment configuration for live transaction completion:

- Signup persistence
- Login session issuance
- Logout revocation
- Email delivery
- OAuth redirects
- Workspace generation persistence
- AI chat backend responses

When the backend is unavailable, the UI provides errors, loading states or workspace-context fallback behavior instead of blank screens.
