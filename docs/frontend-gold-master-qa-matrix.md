# Gold Master QA Matrix

## Regression Matrix

| Area | Route | Expected Result |
| --- | --- | --- |
| Landing | `/` | Public page loads with premium AI OS positioning. |
| Login | `/auth/login` | Login form, Google option and recovery link are visible. |
| Signup | `/auth/signup` | Account creation flow is business-friendly. |
| Forgot password | `/auth/forgot-password` | Recovery form loads with clear guidance. |
| Reset password | `/auth/reset-password` | Reset form loads and validates input. |
| Email verification | `/auth/verify-email` | Verification UI is available. |
| Onboarding | `/onboarding` | AI-guided business setup loads. |
| Workspace | `/workspace-launcher` | Command center loads with adaptive workspace shell. |
| Search | top navigation | Search returns modules, entities, reports, AI and settings. |
| Notifications | top navigation | Notifications reflect workspace signals. |
| Settings | `/settings` | Unified settings loads. |
| AI Copilot | global dock | Copilot opens, minimizes and accepts prompts. |
| Profile | top navigation | Sign out clears session and routes to login. |

## Accessibility Matrix

| Requirement | Status |
| --- | --- |
| Skip navigation | Present |
| Keyboard search shortcut | Present |
| Command palette shortcut | Present |
| Focus-visible styling | Present |
| Notification button label | Present |
| AI Copilot region label | Present |
| Breadcrumb navigation | Present |
| Mobile sidebar close control | Present |

## Cross-Browser Matrix

| Browser | Status |
| --- | --- |
| Chrome stable | Ready for staging QA |
| Edge stable | Ready for staging QA |
| Firefox stable | Ready for staging QA |
| Safari current | Ready for staging QA |
| Mobile Safari | Ready for staging QA |
| Chrome Android | Ready for staging QA |

## Performance Matrix

| Gate | Status |
| --- | --- |
| Next production build | Required |
| Route prerendering | Required |
| Source cleanup audit | Required |
| Smoke test | Required |
| Lighthouse | Staging gate |
