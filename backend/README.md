# Backend

This is the FlowForge API server.

## What it does

- Auth, users, and role-based access
- Product and inventory management
- Orders, payments, and fulfillment flows
- Email notifications and event-driven updates
- Real-time WebSocket notifications for connected clients

## Tech

- Node.js + TypeScript
- Express
- PostgreSQL
- Redis
- Socket.IO
- Zod validation
- JWT + Google auth support

## Run locally

```bash
cd backend
cp .env.example .env
pnpm install
pnpm dev
```

The server starts with the app entry in `src/server.ts` and listens on the port defined in `PORT`.

## Key folders

- `src/app.ts` — API setup and route registration
- `src/modules/` — domain modules such as auth, products, orders, payments, inventory
- `src/database/` — DB connection and SQL migrations
- `src/infrastructure/` — Redis, email, payments, WebSocket, and event infrastructure
- `src/config/env.ts` — environment validation

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Notes

The backend expects PostgreSQL and Redis to be available locally, and the environment file must include the required keys for database, auth, email, and payment configuration.
