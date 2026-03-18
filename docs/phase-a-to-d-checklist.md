# Phase A-D Verification Checklist

Manual verification steps for completing the membersite foundation through Phase D.

## Test Accounts

- `system_admin` account
- `team_leader` account
- `member_normal` account
- `pending` account
- `suspended` account

## Authentication

- Sign up a new user and confirm a matching `profiles.id = auth.users.id` record exists
- Confirm a new signup lands on `/pending?status=pending`
- Log in with an active member and confirm access to `/dashboard`
- Log in with a pending member and confirm redirect to `/pending?status=pending`
- Log in with a suspended member and confirm redirect to `/pending?status=suspended`
- Confirm logout returns the user to `/login`
- Confirm password reset email flow works

## RBAC

- Log in as `system_admin` and confirm access to `/members/approvals`
- Log in as `team_leader` and confirm access to `/members/approvals`
- Log in as `member_normal` and confirm redirect away from `/members/approvals`
- Confirm admin-only routes remain blocked for non-admin users

## Approval Workflow

- Create a pending account
- Approve the account from `/members/approvals`
- Confirm `profiles.status` changes to `active`
- Confirm the approved user can access `/dashboard`

## Community

- As an active member, open `/community`
- Confirm posts load from Supabase
- Create a post and confirm it appears immediately
- Open the post comments and confirm comments load
- Create a comment and confirm it appears immediately

## Products

- Open `/products`
- Confirm products load from Supabase
- Create a product and confirm it appears immediately
- Confirm the product appears on `/dashboard`

## Events

- Open `/events`
- Confirm events load from Supabase
- Create an event and confirm it appears immediately
- Join an event and confirm the joined count refreshes
- Confirm the event appears on `/dashboard`

## Activity Feed

- Confirm `/dashboard` activity feed loads from `activities`
- Create a post and confirm `post_created` activity appears
- Create a comment and confirm `comment_created` activity appears
- Create a product and confirm `product_created` activity appears
- Create an event and confirm `event_created` activity appears
- Join an event and confirm `event_joined` activity appears

## RLS

- As an unauthenticated user, confirm protected routes redirect to `/login`
- As an authenticated member, confirm own post/comment/product/event inserts succeed
- Confirm users cannot update or delete another member's content
- Confirm only owners can update their own profile
- Confirm `activities` are readable by authenticated users
- Confirm `event_participants` insert works for the authenticated user only

## Final Checks

- Run type-check
- Run build
- Run dev server
- Confirm no obvious console errors on login, dashboard, community, products, events, members, and profile
