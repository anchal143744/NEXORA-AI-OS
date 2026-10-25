# Session Management

## Implemented Scope

Session management is implemented under `apps/api/src/modules/sessions` and wired into AuthModule.

## Features

- JWT access token issue
- Refresh token issue
- Refresh token hashing with SHA-256 before storage
- Session store using Prisma Session model
- Device metadata capture through user agent, IP address, and device name
- Multi-device sessions
- Individual session revocation
- Logout all devices
- Refresh-token validation against active session state

## Session Flow

1. User logs in with tenant ID, email, and password.
2. Password is verified using Argon2id.
3. Access and refresh tokens are issued.
4. Refresh token hash is stored on the session record.
5. Login audit record is written.
6. Refresh flow validates both JWT signature and stored refresh token hash.
7. Logout revokes one or all active sessions.

## Security Properties

- Refresh tokens are not stored in plaintext.
- Session revocation marks sessions as revoked with timestamp.
- Multi-device login is supported by separate session records.
- Password reset and password change revoke all user sessions.
