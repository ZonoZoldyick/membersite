# Database Design

membersite community platform

---

## 1. Database Overview

The membersite platform uses **PostgreSQL** as the primary database through Supabase.

The database must support:

- user authentication
- role based access control
- community posts
- product catalog
- event management
- event participation
- notifications
- membership tiers

The design follows a **modular relational model** so new features can be added without rewriting core tables.

---

## 2. Design Principles

The schema should follow these principles:

- use Supabase Auth for authentication identity
- keep application profile data separate from authentication data
- normalize core relationships first
- use foreign keys for consistency
- use timestamps on all major entities
- prepare for row level security from the beginning

---

## 3. Core Entities

The platform includes the following core entities:

- `auth.users` managed by Supabase
- `profiles`
- `roles`
- `membership_tiers`
- `products`
- `events`
- `posts`
- `comments`
- `event_participants`
- `notifications`

These entities represent the main data used by the platform.

---

## 4. Identity and Profile Model

### `auth.users`

Supabase manages authentication users in `auth.users`.

This table should not be treated as the main application profile table.

### `profiles`

Stores application-level member data linked to `auth.users`.

Recommended fields:

- `id` uuid primary key references `auth.users.id`
- `email` text unique
- `display_name` text
- `role_id` bigint references `roles.id`
- `membership_tier_id` bigint references `membership_tiers.id`
- `status` text
- `bio` text nullable
- `avatar_url` text nullable
- `created_at` timestamptz
- `updated_at` timestamptz

Recommended status values:

- `pending`
- `active`
- `suspended`

Why this structure:

- authentication stays in Supabase Auth
- community-specific data stays in application tables
- approval workflow can be managed without altering auth internals

---

## 5. Roles Table

Defines permission levels.

### `roles`

Recommended fields:

- `id` bigint primary key generated always as identity
- `name` text unique
- `description` text nullable
- `created_at` timestamptz

Example values:

- `system_admin`
- `team_leader`
- `member_normal`
- `member_gold`
- `member_platinum`

This table is useful when role names may expand later.

If the team prefers simpler enforcement at first, role values could also be represented by a constrained text column, but the current architecture aligns better with a dedicated `roles` table.

---

## 6. Membership Tiers Table

Defines membership tiers and access levels.

### `membership_tiers`

Recommended fields:

- `id` bigint primary key generated always as identity
- `name` text unique
- `description` text nullable
- `created_at` timestamptz

Example values:

- `normal`
- `gold`
- `platinum`

This is intentionally separate from roles:

- roles control permissions
- membership tiers control content and benefits

---

## 7. Products Table

Members can introduce products.

### `products`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `profile_id` uuid references `profiles.id`
- `title` text
- `description` text
- `price` numeric nullable
- `url` text nullable
- `tags` text[] default `{}`
- `published_at` timestamptz nullable
- `created_at` timestamptz
- `updated_at` timestamptz
- `deleted_at` timestamptz nullable

Notes:

- `profile_id` should reference the application profile, not auth directly
- `published_at` is helpful if drafts are needed later

---

## 8. Events Table

Members can create events.

### `events`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `profile_id` uuid references `profiles.id`
- `title` text
- `description` text
- `event_date` timestamptz
- `location` text nullable
- `url` text nullable
- `capacity` integer nullable
- `created_at` timestamptz
- `updated_at` timestamptz
- `deleted_at` timestamptz nullable

Additional fields may be added later:

- `visibility`
- `status`
- `registration_deadline`

---

## 9. Event Participants Table

Tracks event participation.

### `event_participants`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `event_id` uuid references `events.id`
- `profile_id` uuid references `profiles.id`
- `status` text
- `created_at` timestamptz
- `updated_at` timestamptz

Recommended status values:

- `pending`
- `approved`
- `cancelled`

Recommended constraint:

- unique (`event_id`, `profile_id`)

This prevents duplicate registrations for the same event.

---

## 10. Posts Table

Community timeline posts.

### `posts`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `profile_id` uuid references `profiles.id`
- `type` text
- `content` text
- `created_at` timestamptz
- `updated_at` timestamptz
- `deleted_at` timestamptz nullable

Example `type` values:

- `post`
- `announcement`
- `knowledge`
- `question`

If post behavior grows later, this may evolve into a richer content model, but a single posts table is a good starting point.

---

## 11. Comments Table

Stores comments on posts.

### `comments`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `post_id` uuid references `posts.id`
- `profile_id` uuid references `profiles.id`
- `content` text
- `created_at` timestamptz
- `updated_at` timestamptz
- `deleted_at` timestamptz nullable

---

## 12. Notifications Table

Stores notifications for users.

### `notifications`

Recommended fields:

- `id` uuid primary key default `gen_random_uuid()`
- `profile_id` uuid references `profiles.id`
- `type` text
- `reference_id` uuid nullable
- `is_read` boolean default `false`
- `created_at` timestamptz

Example `type` values:

- `event_join`
- `comment`
- `approval_request`
- `new_post`

Notes:

- `is_read` is clearer than using a column named `read`
- `reference_id` can point to a related entity id, but polymorphic references should be documented carefully in implementation

---

## 13. Relationships

Main relationships:

- `auth.users` 1:1 `profiles`
- `roles` 1:N `profiles`
- `membership_tiers` 1:N `profiles`
- `profiles` 1:N `products`
- `profiles` 1:N `events`
- `profiles` 1:N `posts`
- `posts` 1:N `comments`
- `events` 1:N `event_participants`
- `profiles` 1:N `event_participants`
- `profiles` 1:N `notifications`

This structure supports the current product scope and remains extensible.

---

## 14. Index Recommendations

Indexes should be added for frequently queried fields.

Recommended indexes:

- `profiles.email`
- `profiles.role_id`
- `profiles.membership_tier_id`
- `products.profile_id`
- `events.profile_id`
- `events.event_date`
- `posts.profile_id`
- `comments.post_id`
- `event_participants.event_id`
- `event_participants.profile_id`
- `notifications.profile_id`
- `notifications.is_read`

Recommended unique indexes:

- `profiles.email`
- `roles.name`
- `membership_tiers.name`
- `event_participants(event_id, profile_id)`

---

## 15. Soft Delete Strategy

Instead of deleting records permanently, the system may use soft deletes.

Recommended field:

- `deleted_at`

Suggested target tables:

- `products`
- `events`
- `posts`
- `comments`

Soft delete improves recovery and auditing, but queries must consistently exclude deleted rows.

---

## 16. Approval Workflow Support

The architecture requires member approval before full access.

At minimum, this can be handled with:

- `profiles.status`

If approval history becomes important, add a dedicated table later:

- `member_approvals`

Possible future fields:

- approver profile id
- decision
- note
- decided_at

For the initial version, `profiles.status` is enough.

---

## 17. Learning Access Support

The architecture includes gated learning content.

The initial schema does not yet require learning tables, but access control should already assume membership-tier-based visibility.

Possible future tables:

- `learning_contents`
- `courses`
- `lessons`
- `content_access_rules`

This matches the learning module described in the architecture.

---

## 18. Supabase Integration

Recommended implementation direction:

- authenticate users with Supabase Auth
- create a `profiles` row after signup
- store approval status and application metadata in `profiles`
- protect member data with Row Level Security policies

Recommended service boundaries from the architecture:

- `services/supabase/client.ts`
- `services/supabase/server.ts`
- `services/repositories/*.ts`

This keeps direct database access out of page components.

---

## 19. Data Security

Sensitive data must not be stored in plaintext.

- passwords must be handled only by the authentication system
- secrets must be stored in environment variables
- authorization should not rely only on the frontend
- Row Level Security should be enabled on application tables

---

## 20. Migration Strategy

Database schema changes should use migrations.

Recommended approach:

- use Supabase migrations as the primary migration path
- avoid mixing migration systems early unless there is a clear reason

At this stage, Supabase migrations are a better fit than introducing Prisma migrations as a second schema source.

---

## 21. Immediate Implementation Guidance

For the next step of this project:

- create the initial SQL schema around `profiles`, `roles`, and `membership_tiers`
- define domain types that mirror the core tables
- prepare RLS-aware repository boundaries
- keep the first migration small and focused

This keeps the implementation aligned with the architecture document and reduces refactor risk later.
