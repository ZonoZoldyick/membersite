# Architecture Design

membersite community platform

---

## 1. System Overview

membersite is a membership community platform where members can:

- introduce products
- organize events
- share knowledge
- participate in community activities

The platform has two main areas:

1. Public website (before login)
2. Member community (after login)

---

## 2. System Architecture

The platform follows a modern web architecture.

### Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS

### Backend

- Supabase

### Database

- PostgreSQL

### Hosting

- Vercel

### Repository

- GitHub

---

## 3. Application Layers

The application is divided into the following layers.

### UI Layer

- App Router pages and layouts
- Shared UI components
- Feature-specific presentation components

### Feature Layer

- Feature modules grouped by business domain
- Use cases and view models
- Validation and feature-specific types

### Service Layer

- Supabase client access
- API communication
- Repository-style data access helpers

### Infrastructure Layer

- Authentication
- Database
- Environment configuration
- Access control policies

---

## 4. Recommended Project Structure

The project follows a feature-based structure while keeping Next.js routing in `app/`.

```text
membersite/
  app/
    (public)/
    (member)/
    api/
  components/
    ui/
    layout/
  features/
    auth/
    community/
    products/
    events/
    learning/
    members/
    notifications/
  lib/
    auth/
    constants/
    utils/
  services/
    supabase/
    repositories/
  types/
    domain/
    api/
  public/
  styles/
  docs/
  scripts/
  tests/
    unit/
    integration/
```

Notes:

- `app/` owns routes, layouts, and route-level composition.
- `features/` owns business modules and keeps feature logic out of `app/`.
- `components/` is reserved for shared, cross-feature UI.
- `services/` handles data access and external integrations.
- `lib/` contains framework-agnostic helpers and shared utilities.

---

## 5. Route Strategy

### Public Area

- `/`
- `/login`
- `/signup`

Public marketing sections such as community introduction, upcoming events, and free knowledge resources can be composed on the top page first, then split into dedicated routes later if needed.

### Member Area

- `/dashboard`
- `/community`
- `/products`
- `/events`
- `/learning`
- `/members`
- `/profile`

Route groups should be used to separate public and authenticated experiences:

- `app/(public)/...`
- `app/(member)/...`

The member route group should later include an authenticated layout.

---

## 6. Core Modules

The platform is composed of the following modules.

- Authentication
- User management
- Community posts
- Product catalog
- Event management
- Learning content
- Member directory
- Notification system

Each module should follow the same internal pattern where practical:

- `components/`
- `hooks/`
- `services/`
- `types/`

Large modules may also add:

- `schemas/`
- `utils/`

---

## 7. Role Based Access Control (RBAC)

The system supports multiple user roles:

- `system_admin`
- `team_leader`
- `member_normal`
- `member_gold`
- `member_platinum`

Permissions are determined by role.

### Example responsibilities

- `system_admin`: full system control
- `team_leader`: approve members, manage team members
- `member_normal`: manage profile, products, and events
- `member_gold`: access premium learning
- `member_platinum`: access exclusive content and events

RBAC should be enforced both:

- in the UI for navigation and visibility
- in the backend and database policies for actual authorization

---

## 8. Authentication Flow

### User Registration

1. User submits signup form
2. User status is stored as `pending`
3. Admin and team leader receive approval request

### After Approval

1. User status changes to `active`
2. User can login
3. User gains access according to role

This suggests separating:

- authentication identity
- membership profile
- approval status
- role assignment

---

## 9. Main User Flow

### Visitor

1. Visit public site
2. View community information
3. Sign up

### Member

1. Login
2. Open dashboard
3. Participate in community

Examples:

- create post
- publish product
- create event
- join event
- access learning materials

---

## 10. Data and Integration Direction

Initial integration direction:

- Supabase Auth for login and session management
- Supabase Database for application data
- Supabase storage only when file uploads become necessary

Recommended separation:

- `services/supabase/client.ts`
- `services/supabase/server.ts`
- `services/repositories/*.ts`

This keeps direct database access out of page components.

---

## 11. Security Design

- Use Supabase authentication
- Use role-based access control
- Store secrets in environment variables
- Never expose private keys
- Distinguish client-safe env vars from server-only env vars

Security should be enforced at multiple layers:

- route protection
- server actions or API handlers
- database policies

---

## 12. Scalability Considerations

Future expansions may include:

- payment system
- subscription membership
- event ticketing
- ranking system
- mobile application

To support expansion, architecture should remain:

- modular
- typed
- feature-oriented
- loosely coupled between UI and data access

---

## 13. Development Roadmap

Development should follow this order:

1. Architecture
2. Database design
3. Authentication system
4. UI layout
5. Feature implementation

---

## 14. Immediate Implementation Guidance

For the current initial scaffold:

- keep routes minimal
- avoid feature implementation
- prepare folders for public and member areas
- prepare feature module directories
- prepare service and type boundaries early

This keeps the repository aligned with the target architecture without overbuilding too early.
