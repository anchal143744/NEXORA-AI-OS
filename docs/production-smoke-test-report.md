# Production Smoke Test Report

## Smoke Test Scope

Production smoke tests must validate Homepage, Signup, Login, Logout, Forgot Password, Email Verification, Organization Creation, Workspace Generation, Dashboard, AI Copilot, Search, Settings and Notifications.

## Current Evidence

The latest SRC production-web route smoke passed locally after a clean Next build. Routes verified included `/`, `/auth/signup`, `/auth/login`, `/onboarding`, `/workspace-launcher`, `/command-center`, `/settings` and `/ai-agents/copilot`.

## Blocked Smoke Tests

Full production smoke testing is blocked because the Redis-backed API cannot start locally and hosted production URLs were not supplied.

## Required Next Run

Set `NEXORA_PRODUCTION_WEB_URL` and `NEXORA_PRODUCTION_API_URL`, bring Redis/API/worker services online, then run `npm.cmd run production:launch-gate`, `npm.cmd run staging:e2e` and API E2E validation.