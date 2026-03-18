# Phase E Login Verification

Run these checks in order after the local app is available at `http://localhost:3000`.

## Pre-check

- Confirm Node.js is `18.18.0` or newer
- Confirm `npm run type-check` passes
- Confirm `npm run build` passes
- Confirm `npm run dev` starts successfully

## Required Accounts

- `system_admin`
- `team_leader`
- `member_normal`
- `pending`
- `suspended`

## 1. Admin Login Flow

- Open `/login`
- Log in with the `system_admin` account
- Confirm redirect to `/dashboard`
- Open `/members/approvals`
- Confirm the approvals screen is visible
- Confirm the sidebar shows the `Approvals` entry

## 2. Leader Login Flow

- Log out
- Log in with the `team_leader` account
- Confirm redirect to `/dashboard`
- Open `/members/approvals`
- Confirm the approvals screen is visible

## 3. Member Login Flow

- Log out
- Log in with the `member_normal` account
- Confirm redirect to `/dashboard`
- Open `/members/approvals`
- Confirm redirect away from the approvals page
- Open `/community`, `/products`, `/events`, `/members`, and `/profile`
- Confirm each page loads

## 4. Pending Login Flow

- Log out
- Log in with the `pending` account
- Confirm redirect to `/pending?status=pending`

## 5. Suspended Login Flow

- Log out
- Log in with the `suspended` account
- Confirm redirect to `/pending?status=suspended`

## 6. Approval Flow

- Log out
- Log in with the `system_admin` or `team_leader` account
- Open `/members/approvals`
- Approve the `pending` account
- Log out
- Log in again with the previously pending account
- Confirm redirect to `/dashboard`

## 7. Feature Smoke Test

- As an active member, create a post
- Add a comment to a post
- Create a product
- Create an event
- Join an event
- Return to `/dashboard`
- Confirm the activity feed updates

## 8. Failure Checklist

- If `/members/approvals` is inaccessible for admin or leader, check role records in `profiles`
- If authenticated users are sent to `/pending`, check `profiles.status`
- If create actions fail, check RLS policies and foreign keys
- If dashboard sections are empty unexpectedly, check table data in Supabase
