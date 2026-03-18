# membersite

Community membership platform built with Next.js, TypeScript, TailwindCSS, and Supabase.

## Requirements

- Node.js `18.18.0` or newer
- npm
- Supabase project with the required migrations applied

## Setup

1. Install dependencies

```bash
npm install
```

2. Run type-check

```bash
npm run type-check
```

3. Run production build

```bash
npm run build
```

4. Start the development server

```bash
npm run dev
```

Windows helper script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
```

Start the dev server from the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1 -StartDevServer
```

## Verification

- Foundation checklist: [docs/phase-a-to-d-checklist.md](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/docs/phase-a-to-d-checklist.md)
- Login verification flow: [docs/phase-e-login-verification.md](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/docs/phase-e-login-verification.md)
- Auth debug setting rollback: [docs/supabase-auth-debug-settings.md](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/docs/supabase-auth-debug-settings.md)
- Automated verification strategy: [docs/test-strategy.md](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/docs/test-strategy.md)
- Schema change runbook: [docs/schema-change-and-validation.md](C:/Users/takas/OneDrive/ドキュメント/Codex/membersite/docs/schema-change-and-validation.md)

## Project Structure

The repository follows the structure defined in `AGENTS.md`.

- `app/`
- `components/`
- `features/`
- `lib/`
- `services/`
- `types/`
- `public/`
- `styles/`
- `docs/`
- `scripts/`
- `tests/`
