# Task List

membersite implementation tasks ordered by execution sequence and priority.

## Current Remaining Work

### A. Immediate Stabilization

- Priority: High
- Goal: Close the remaining verification gaps before moving further into feature expansion.
- Main work:
  - Stabilize the admin approvals E2E flow
  - Re-run `type-check`, `build`, and full auth E2E after each auth or schema change
  - Commit the pending auth/test/schema-alignment fixes once green
- Done when:
  - Auth E2E passes end-to-end
  - Type-check and build both pass
  - The repo is ready for the next feature phase on a clean baseline

### B. Manual Approval Flow Verification

- Priority: High
- Goal: Finish the real browser confirmation of the approval workflow.
- Main work:
  - Log in as admin or leader
  - Open `/members/approvals`
  - Approve a pending user and verify they become active
  - Confirm the approved user can reach the member area
- Done when:
  - Approval works in the real UI, not only in automated coverage
  - Pending users become active as expected

### C. Automated Community and Sharing Verification

- Priority: Medium
- Goal: Expand E2E coverage from auth to the main member actions.
- Main work:
  - Add E2E coverage for post creation
  - Add E2E coverage for comment creation
  - Add E2E coverage for product creation
  - Add E2E coverage for event creation and event join
  - Verify activity feed reflection where applicable
- Done when:
  - Core member creation flows are covered by Playwright
  - Reports can be reviewed after each run

## 1. Posts Read

- Priority: High
- Goal: Load the community timeline from Supabase using real post data.
- Main work:
  - Replace mock post feed data with `posts` table reads
  - Sort by `created_at desc`
  - Resolve author display from profile-related data
  - Stabilize loading, empty, and error states
- Done when:
  - `/community` shows real posts from Supabase
  - Empty and error states render correctly

## 2. Posts Write

- Priority: High
- Goal: Allow authenticated members to create posts in Supabase.
- Main work:
  - Replace mock `createPost()` with real insert logic
  - Confirm authenticated user and profile existence
  - Update feed immediately after successful creation
  - Keep activity creation linked to post creation
- Done when:
  - A logged-in member can create a post
  - New posts appear immediately in the timeline
  - `post_created` activity is generated

## 3. Comments Read

- Priority: High
- Goal: Load comments for each post from Supabase.
- Main work:
  - Replace mock comment reads with `comments` table reads
  - Filter by `post_id`
  - Define stable display ordering
  - Keep comment thread UI resilient with empty data
- Done when:
  - Each post shows only its own comments
  - Comment lists load consistently

## 4. Comments Write

- Priority: High
- Goal: Allow authenticated members to add comments to posts.
- Main work:
  - Replace mock `createComment()` with real insert logic
  - Save `post_id` and `author_id`
  - Update comment list after successful insert
  - Keep activity creation linked to comment creation
- Done when:
  - A logged-in member can submit a comment
  - The comment appears immediately under the post
  - `comment_created` activity is generated

## 5. Dashboard Real Data

- Priority: High
- Goal: Turn the dashboard into a real member home screen.
- Main work:
  - Load recent activities from `activities`
  - Load featured products from `products`
  - Load upcoming events from `events`
  - Add stable empty and error states per section
- Done when:
  - `/dashboard` no longer relies on mock content
  - Members see real activity, products, and events

## 6. Approval Screen

- Priority: High
- Goal: Make the member approval workflow operational.
- Main work:
  - Create admin/leader-only pending member screen
  - Load `pending` users from `profiles`
  - Approve users by updating `status` to `active`
  - Verify middleware and RBAC restrictions
- Done when:
  - Admins and leaders can approve pending members
  - Approved users can access the member area

## 7. Likes Real Data

- Priority: Medium
- Goal: Replace mock likes with Supabase-backed engagement data.
- Main work:
  - Connect `likeService` to `likes` table
  - Update post and comment like counts from real data
  - Keep `like_created` activity generation linked
- Done when:
  - Likes persist in the database
  - Counts and toggle state stay in sync

## 8. Products Create and Read Completion

- Priority: Medium
- Goal: Finalize products as a real member content feature.
- Main work:
  - Replace remaining mock assumptions in products UI
  - Add proper form fields such as title and description
  - Confirm list reads and create flow work end-to-end
- Done when:
  - Members can create products
  - Products list reflects database state reliably

## 9. Events Create and Join Completion

- Priority: Medium
- Goal: Finalize event publishing and participation flows.
- Main work:
  - Replace remaining mock assumptions in events UI
  - Connect event creation to real `events` data
  - Connect join flow to `event_participants`
  - Reflect participation count from real data
- Done when:
  - Members can create and join events
  - Event list and join counts reflect real state

## 10. Profile Editing

- Priority: Medium
- Goal: Allow members to maintain their own public profile.
- Main work:
  - Add edit form for profile fields
  - Save profile changes to Supabase
  - Restrict edits to the owner only
- Done when:
  - Members can update their own profile
  - Changes are visible in member-facing UI

## 11. Learning Access by Membership Tier

- Priority: Medium
- Goal: Enforce tier-based content access for learning content.
- Main work:
  - Connect learning page to real data
  - Apply membership tier guard rules in UI and backend reads
- Done when:
  - Normal, gold, and platinum users see the correct content scope

## 12. Notifications

- Priority: Medium
- Goal: Add basic member notifications for community actions.
- Main work:
  - Generate notifications for comments, likes, and approvals
  - Show a simple notifications list in the member UI
- Done when:
  - Notification records are created and displayed correctly

## 13. Error Handling and Validation

- Priority: Medium
- Goal: Improve reliability and reduce inconsistent form behavior.
- Main work:
  - Separate load errors and mutation errors where needed
  - Add consistent validation for auth, posts, comments, products, and events
- Done when:
  - Forms fail safely and show clear messages

## 14. Type and Schema Alignment

- Priority: Medium
- Goal: Reduce type drift between frontend code and Supabase schema.
- Main work:
  - Replace unsafe casts with generated Supabase types where practical
  - Review hooks and services for schema mismatches
- Done when:
  - Frontend types align with `types/supabase.ts`
  - Type-check remains stable

## 15. Deployment Readiness

- Priority: Low
- Goal: Prepare the project for repeatable team setup and production deployment.
- Main work:
  - Update README and setup documentation
  - Review environment variables and secrets handling
  - Recheck type-check, build, and migration flow
- Done when:
  - Another developer can set up the project reliably
  - Deployment preparation steps are documented

## 16. Playwright Test Foundation

- Priority: High
- Goal: Establish the base automation framework for end-to-end verification.
- Main work:
  - Add Playwright configuration
  - Define report output locations
  - Add shared test setup and teardown
- Done when:
  - E2E tests can run locally
  - HTML report and screenshots are generated

## 17. Automated Test User Management

- Priority: High
- Goal: Remove manual account preparation from auth and RBAC verification.
- Main work:
  - Add helpers to create test users
  - Add helpers to update member role, tier, and status
  - Add helpers to delete and reset test users
- Done when:
  - Admin, leader, member, pending, and suspended test users can be prepared automatically

## 18. Automated Auth and Member Status Verification

- Priority: High
- Goal: Automatically verify signup, login, logout, and member status routing.
- Main work:
  - Add E2E coverage for signup and login
  - Verify redirects for pending, active, and suspended users
  - Save structured results for later review
- Done when:
  - Auth flows run without manual browser checking
  - Status-based redirects are covered automatically

## 19. Automated RBAC and Approval Verification

- Priority: High
- Goal: Automatically verify permissions for admin, leader, and normal member roles.
- Main work:
  - Add E2E coverage for approvals page access
  - Verify that only admin and leader can approve members
  - Confirm approved users become active
- Done when:
  - Approval flow and permission boundaries are covered automatically

## 20. Automated Community and Sharing Verification

- Priority: Medium
- Goal: Automatically verify post, comment, product, and event flows.
- Main work:
  - Add E2E coverage for post and comment creation
  - Add E2E coverage for product creation
  - Add E2E coverage for event creation and join flow
  - Verify dashboard reflection and activity generation
- Done when:
  - Core member actions are covered by automated tests
  - Results can be reviewed from saved reports
