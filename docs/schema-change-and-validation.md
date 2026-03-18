# Schema Change And Validation

## Purpose

This is the runbook for future Supabase table changes and verification.

Use it when you:

- add a table
- change columns
- delete a table
- change foreign keys
- change RLS
- rerun auth or E2E validation

## Core Rule

Local code and tests are not enough.

The order must always be:

1. update migration SQL
2. apply it to remote Supabase
3. reload PostgREST schema cache if needed
4. regenerate [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts)
5. rerun validation

If step 2 or 4 is skipped, the app may fail even when code looks correct.

## Files To Check

- [database/migrations](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/database/migrations)
- [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts)
- [middleware.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/middleware.ts)
- [lib/auth](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/lib/auth)
- [features](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/features)
- [tests/support](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/support)
- [tests/e2e](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/e2e)

## Current Minimum Tables

The current app and E2E foundation depend on:

- `profiles`
- `roles`
- `membership_tiers`
- `posts`
- `comments`
- `products`
- `events`
- `event_participants`
- `activities`

## Standard Change Checklist

### 1. Migration update

Include:

- table definition
- foreign keys
- indexes
- unique constraints
- timestamps
- soft delete if needed
- RLS

### 2. Remote apply

Apply the migration to the real Supabase project.

Important:

- a local SQL file does not change Supabase by itself
- remote DB must actually receive the SQL

### 3. Schema cache reload

If DB query sees a table but REST API says it is missing, reload PostgREST cache:

```sql
NOTIFY pgrst, 'reload schema';
```

### 4. Type regeneration

Regenerate [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts) after remote schema changes.

### 5. App updates

Check for name mismatches such as:

- `author_id` vs `profile_id`
- `username` vs `display_name`
- relation names in `select("roles(name)")`

### 6. Test helper updates

Update:

- [tests/support/test-users.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/support/test-users.ts)
- [tests/support/test-data.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/tests/support/test-data.ts)

## Validation Order

### A. Schema validation

- tables exist
- seed data exists
- RLS exists
- auth trigger exists if needed

### B. Type validation

- new table appears in [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts)
- changed columns match app usage

### C. Auth validation

- signup
- login
- logout
- pending redirect
- suspended redirect
- approvals access

### D. Feature validation

- community read/write
- products read/write
- events read/write
- activity feed

### E. E2E validation

Current auth E2E covers:

- unauthenticated redirect
- admin login and approvals
- member blocked from approvals
- pending redirect
- suspended redirect
- signup to pending

## Known Failure Patterns

### DB exists but REST says missing

Meaning:

- PostgREST schema cache is stale

Action:

- reload schema cache

### TypeScript does not know a new table

Meaning:

- generated types are stale

Action:

- regenerate [types/supabase.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/types/supabase.ts)

### Login works manually but E2E hangs

Current stable path is:

- [features/auth/components/LoginForm.tsx](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/features/auth/components/LoginForm.tsx)
- [app/api/auth/login/route.ts](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/app/api/auth/login/route.ts)

This uses normal form POST + server-side cookie + `303` redirect.

Be careful when changing it back to server action based login.

## Before Closing A Schema Task

Do not close until all are done:

- migration updated
- remote Supabase updated
- schema cache reloaded if needed
- `types/supabase.ts` regenerated
- affected services updated
- affected tests updated
- Playwright rerun
- manual smoke check completed if user-facing

## Current Follow-Up

As of 2026-03-18:

- auth Playwright suite passes
- login flow is stabilized with route handler redirect
- `type-check` still has a separate `activities` type mismatch to fix next

