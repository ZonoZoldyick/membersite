# Core Schema Apply Plan

This document explains how to apply the minimum remote Supabase schema required by the current app and E2E test foundation.

## Why This Is Needed

The current frontend and automated tests expect these tables to exist in the live Supabase project:

- `roles`
- `membership_tiers`
- `profiles`
- `posts`
- `comments`
- `products`
- `events`
- `event_participants`
- `activities`

At the moment, the live project does not expose these tables in the schema cache, so auth setup, RBAC checks, and E2E user preparation cannot complete.

## Minimum Migrations

Apply these files in this order:

1. [database/migrations/001_initial_schema.sql](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/database/migrations/001_initial_schema.sql)
2. [database/migrations/003_auth_profile_trigger.sql](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/database/migrations/003_auth_profile_trigger.sql)
3. [database/migrations/004_activities.sql](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/database/migrations/004_activities.sql)

## Automation Scripts

Apply the core schema:

- [scripts/apply-core-schema.ps1](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/scripts/apply-core-schema.ps1)

Verify the remote schema:

- [scripts/verify-core-schema.ps1](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/scripts/verify-core-schema.ps1)

## Required Environment Variables

- `PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`

These are already expected in the local `.env`.

## Recommended Execution Order

1. Apply core schema
2. Verify required tables exist
3. Verify role and membership seeds exist
4. Regenerate [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts)
5. Re-run E2E auth checks

## Expected Outcome

After the apply step:

- signup can rely on the auth trigger to create `profiles`
- middleware can read `profiles`
- RBAC can read role and membership-tier relations
- Playwright test user setup can create and align admin, leader, member, pending, and suspended users
