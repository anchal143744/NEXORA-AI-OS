# Production Deployment Checklist

## Environment

- NEXT_PUBLIC_API_URL points to the production API.
- NEXT_PUBLIC_APP_URL points to the production web origin.
- NEXT_PUBLIC_APP_ENV is production.
- NEXT_PUBLIC_RELEASE_VERSION matches package.json.
- Backend CORS allows the production web origin.

## Build

- npm.cmd install
- npm.cmd run web:lint
- npm.cmd run web:typecheck
- npm.cmd run web:build
- npm.cmd run web:smoke

## Runtime Verification

- / returns 200.
- /auth/login returns 200.
- /workspace-launcher returns 200.
- /command-center returns 200.
- /not-found behavior is branded and accessible.

## Security

- CSP is present.
- X-Frame-Options is DENY.
- X-Content-Type-Options is nosniff.
- Referrer-Policy is strict-origin-when-cross-origin.
- Permissions-Policy is present.
- API cookies and tokens are configured for production domains.

## Accessibility

- Skip link works.
- Keyboard navigation reaches topbar, command palette, copilot and route content.
- Focus ring is visible.
- Reduced motion preference is respected.
- Mobile touch targets are usable.

## Release Sign-Off

- Product owner approval.
- Engineering approval.
- Security approval.
- Deployment owner approval.
