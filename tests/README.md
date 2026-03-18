# Tests

This directory contains automated verification assets for `membersite`.

## Structure

- `e2e/`
  - Playwright-based browser tests
- `support/`
  - Test user management
  - Test data cleanup and seeding helpers
- `integration/`
  - Reserved for future API or repository integration tests
- `unit/`
  - Reserved for future unit tests

## Current Phase 7 Scope

- Playwright configuration in [playwright.config.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/playwright.config.ts)
- Test user automation in [tests/support/test-users.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/support/test-users.ts)
- Minimal auth and RBAC smoke coverage in [tests/e2e/auth.spec.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/e2e/auth.spec.ts)

## Reports

Generated test artifacts should be written to:

- `tests/reports/playwright`
- `tests/reports/results.json`
