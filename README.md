# FlowForge

FlowForge is a full-stack commerce app with a customer storefront, admin dashboard, order lifecycle, inventory management, payments, and real-time notifications.

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query
- Backend: Node.js, Express, TypeScript, PostgreSQL, Redis, Socket.IO
- Services: email, payment integration, auth, inventory events, notification updates

## Project layout

- `backend/` — Express API, database, business logic, event handlers
- `frontend/` — Vite React app for storefront and back office
- `docker-compose.yml` — Redis and Kafka services for local development

## Local setup

1. Start shared services:

```bash
docker compose up -d
```

2. Backend:

```bash
cd backend
cp .env.example .env
pnpm install
pnpm dev
```

3. Frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Open the frontend in the browser and make sure the backend env values point to your local PostgreSQL, Redis, and frontend URL.

## Main flows

- Customer auth and store browsing
- Cart and checkout
- Order creation and payment
- Inventory reservation and fulfillment updates
- Admin portal for orders, payments, inventory, and users
- Socket-based notifications

## Useful scripts

- Backend: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`
- Frontend: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm lint`
