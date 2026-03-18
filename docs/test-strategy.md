# Test Strategy

Automated verification strategy for `membersite`.

## Goal

Reduce manual checking for signup, login, RBAC, member status, and core content flows.

The target is to make it possible to answer:

- what was tested
- how far the test suite covered the app
- whether the latest run passed or failed
- which screen or permission failed
- what test users and database state were used

## Scope

This strategy focuses on everything except real email inbox verification.

Included:

- signup flow without manual email confirmation
- login
- logout
- password reset request screen behavior
- protected route redirects
- member status checks
- RBAC checks
- approvals flow
- community posting
- comments
- products
- events
- dashboard reflections
- database state verification
- RLS-oriented behavior verification from the app side

Excluded for now:

- real email inbox delivery checks
- email template rendering checks
- third-party mail provider integration checks

## Test Layers

### 1. E2E UI Tests

Use Playwright to automate browser behavior.

Examples:

- open `/login`
- sign in as admin
- confirm `/dashboard`
- open `/members/approvals`
- create a post
- create a comment
- create a product
- create an event
- join an event

Purpose:

- verify real user flows
- verify redirects and UI behavior
- catch routing, auth, and form regressions

### 2. Auth and Database Setup Helpers

Use Supabase admin access for test preparation.

Capabilities:

- create test users
- update user password
- delete test users
- align `profiles.status`
- align `profiles.role_id`
- align `profiles.membership_tier_id`
- seed or clean test data

Purpose:

- avoid manual account preparation
- ensure repeatable test preconditions
- make pending, active, and suspended states reproducible

### 3. Result Persistence

Store outputs from every test run.

Artifacts:

- Playwright HTML report
- screenshots
- optional videos
- machine-readable JSON result summary
- optional Markdown run summary

Purpose:

- review failures later
- compare runs over time
- know exactly what passed and failed

## Coverage Areas

### Authentication

- signup succeeds
- login succeeds
- logout succeeds
- password reset request form behaves correctly
- unauthenticated access redirects to `/login`

### Member Status

- `pending` redirects to `/pending?status=pending`
- `active` enters `/dashboard`
- `suspended` redirects to `/pending?status=suspended`
- missing profile redirects to `/pending?status=missing_profile`

### RBAC

- `system_admin` can access approvals
- `team_leader` can access approvals
- `member_normal` cannot access approvals
- non-admin users cannot access admin-only routes

### Approval Workflow

- pending member appears in approvals list
- admin or leader can approve
- `profiles.status` becomes `active`
- approved member can log in and enter member pages

### Community

- posts list loads
- post creation works
- comment list loads
- comment creation works
- activity feed reflects post and comment creation

### Products

- products list loads
- product creation works
- created product appears on dashboard

### Events

- events list loads
- event creation works
- event join works
- joined count refreshes
- created event appears on dashboard

### Dashboard

- activity section loads
- products section loads
- events section loads
- empty states render safely

### Data Integrity

- `auth.users.id` matches `profiles.id`
- role exists for every test profile
- membership tier exists for every test profile
- created activities match performed actions

## Test User Management

Test users should be managed automatically.

Recommended accounts:

- `admin_e2e@membersite.local`
- `leader_e2e@membersite.local`
- `member_e2e@membersite.local`
- `pending_e2e@membersite.local`
- `suspended_e2e@membersite.local`

Supported actions:

- create
- update
- delete
- reset password
- set role
- set membership tier
- set member status

Recommended implementation split:

- Auth user create/delete with Supabase admin API or service role client
- Profile state updates with service role client

## Recommended File Structure

```text
tests/
├─ e2e/
│  ├─ auth.spec.ts
│  ├─ rbac.spec.ts
│  ├─ member-status.spec.ts
│  ├─ approvals.spec.ts
│  ├─ community.spec.ts
│  └─ sharing.spec.ts
├─ support/
│  ├─ auth-admin.ts
│  ├─ test-users.ts
│  ├─ test-data.ts
│  └─ assertions.ts
└─ reports/
   ├─ playwright/
   ├─ screenshots/
   ├─ results.json
   └─ latest-summary.md
```

## Execution Model

1. Start local app
2. Prepare test users
3. Prepare baseline data
4. Run Playwright suites
5. Save reports
6. Review failed screenshots and summary
7. Clean up or keep fixtures for the next run

## Reporting Requirements

Each run should record:

- timestamp
- git branch or commit if available
- environment name
- passed test count
- failed test count
- skipped test count
- failed scenarios
- artifact paths

## MVP Implementation Order

1. Playwright setup
2. Test user admin helper
3. `auth.spec.ts`
4. `member-status.spec.ts`
5. `rbac.spec.ts`
6. `approvals.spec.ts`
7. `community.spec.ts`
8. `sharing.spec.ts`

## Operational Notes

- Keep email auto-confirm enabled only while local auth testing needs it
- Prefer a dedicated Supabase test project over shared production-like data
- Never mix automated test users with real member accounts
- Keep service role usage inside test helpers only
