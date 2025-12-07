# Vaquita

Vaquita is a crowd-pooling web application built as a pnpm monorepo. It includes a Fastify + Prisma backend with JWT authentication and a React + Vite + Tailwind frontend.

## Project Structure

```
/vaquita
  pnpm-workspace.yaml
  tsconfig.json
  apps/
    backend/
    frontend/
```

## Prerequisites
- Node.js 18+
- [pnpm](https://pnpm.io/installation)

## Getting Started

```bash
pnpm install
```

### Backend

```bash
cd apps/backend
pnpm migrate       # run Prisma migrations
pnpm seed          # seed demo data
pnpm dev           # start Fastify server on http://localhost:3000
```

### Frontend

```bash
cd apps/frontend
pnpm dev           # start Vite dev server on http://localhost:5173
```

### Root Scripts

```bash
pnpm --filter ./apps/backend dev
pnpm --filter ./apps/frontend dev
```

## Prisma
The backend uses SQLite located at `apps/backend/prisma/dev.db`.

- Update schema: `cd apps/backend && pnpm migrate`
- Seed: `cd apps/backend && pnpm seed`

## Testing

```bash
cd apps/backend
pnpm test
```

## Mocked Integrations
- Payment provider always returns PAID with a random reference.
- Email service logs invite payloads to the console.

## Features
- JWT auth (register/login/me)
- Pool creation, updating, closing, and visibility controls
- Contributions with visibility filters and mocked payments
- Invite tokens for sharing private pools
- React frontend with shadcn-inspired components, Tailwind, framer-motion animations
