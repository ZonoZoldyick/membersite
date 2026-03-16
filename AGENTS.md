# AGENTS.md

## Project Name

membersite

## Project Purpose

This project is a community membership platform.

Members can introduce products, organize events, share knowledge, and participate in community discussions.

The platform has two layers:

1. Public website (before login)
2. Member community (after login)

The goal is to create a business collaboration community where members promote products and events.

---

# Tech Stack

Frontend

* Next.js (App Router)
* React
* TypeScript

Backend

* Supabase

Database

* PostgreSQL

UI

* TailwindCSS

Hosting (planned)

* Vercel

Repository

* GitHub

---

# Architecture Principles

Follow these principles when generating code.

1. Use feature-based architecture
2. Separate UI, logic, and data access
3. Keep components reusable
4. Avoid large monolithic files
5. Prefer TypeScript types over any

---

# Project Folder Structure

The repository follows this structure.

membersite

app/
components/
features/
lib/
services/
types/
public/
styles/
docs/
scripts/
tests/

.github/

README.md
AGENTS.md

Do not change this structure unless explicitly requested.

---

# Application Structure

Public pages:

/
community introduction
upcoming events
free knowledge
login
signup

Member pages:

/dashboard
/community
/products
/events
/learning
/members
/profile

---

# User Roles

The system includes the following roles.

system_admin
team_leader
member_normal
member_gold
member_platinum

Permissions:

system_admin

* full system access
* manage roles
* approve users

team_leader

* approve members
* manage team members

member_normal

* manage profile
* manage products
* manage events

member_gold

* same as normal
* access premium learning materials

member_platinum

* full learning access
* access exclusive events

---

# Core Features

The platform includes the following modules.

Community timeline
Product catalog
Event management
Learning materials
Member directory
Notifications
User approval workflow

---

# Authentication Flow

Signup

User registers
status = pending
admin and leader receive approval request

After approval:

User can login and access dashboard.

---

# Coding Rules

Use TypeScript strict mode.

React components must use functional components.

File naming rules:

Components
PascalCase

Functions
camelCase

Types
PascalCase

Avoid any type.

Prefer small reusable components.

---

# Security Rules

Never expose secrets.

Environment variables must be stored in

.env.local

Do not commit secrets to GitHub.

---

# AI Agent Instructions

When implementing features:

1. Check the folder structure first
2. Reuse existing components if possible
3. Keep code modular
4. Avoid unnecessary dependencies
5. Follow Next.js best practices

---

# Development Steps

Development should follow this order.

1 Architecture
2 Database schema
3 Authentication
4 UI layout
5 Features

---

# Future Expansion

Planned features include:

payment system
event ticketing
subscription membership
ranking system
mobile optimization

---

# Documentation

All design documents must be stored in

docs/

Example:

docs/architecture.md
docs/database.md
docs/features.md
