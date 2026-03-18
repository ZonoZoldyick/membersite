# Roadmap

membersite phased roadmap for a member-only community platform where users can log in, post content, and share products and events.

## Phase 1: Core Member Access

- Complete authentication flow validation
- Stabilize profile creation on signup
- Confirm `pending` / `active` / `suspended` behavior
- Finalize production-safe RLS for core tables

Outcome:
- Members can authenticate safely and enter the site only when approved

## Phase 2: Community Foundation

- Implement real posts read flow
- Implement real posts write flow
- Implement real comments read flow
- Implement real comments write flow
- Keep activity generation connected to community actions

Outcome:
- Logged-in members can post and comment in a real community timeline

## Phase 3: Member Home Experience

- Replace dashboard mock content with real activities
- Load featured products from real data
- Load upcoming events from real data

Outcome:
- The dashboard becomes a useful entry point for active members

## Phase 4: Community Sharing Features

- Finalize products create and read flows
- Finalize events create and join flows
- Complete likes with real persistence
- Add profile editing

Outcome:
- Members can share content, products, and events in a practical way

## Phase 5: Membership Operations

- Build approval screen for admins and leaders
- Apply RBAC in navigation and protected views
- Add membership-tier-based learning access
- Add notifications for important actions

Outcome:
- The site operates as a managed membership community, not only a content feed

## Phase 6: Quality and Release Readiness

- Improve validation and error handling
- Align frontend types with generated Supabase types
- Finalize setup and deployment documentation
- Recheck build, type-check, and migration workflow

Outcome:
- The project becomes safer to maintain, deploy, and onboard to

## Phase 7: Automated Verification

- Introduce Playwright-based E2E automation
- Automate test user creation, update, and deletion
- Automate auth, member status, and RBAC verification
- Automate community, product, and event flow verification
- Persist reports so test results can be reviewed later

Outcome:
- The project can be evaluated repeatedly without relying on detailed manual browser checks
