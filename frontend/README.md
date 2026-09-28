# Frontend

This is the FlowForge client app for the storefront and admin portal.

## What it includes

- Customer shopping experience
- Cart and checkout flow
- Order tracking and notifications
- Admin dashboard for products, orders, inventory, and payments
- Role-based access for customers and staff

## Tech

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Socket.IO client

## Run locally

```bash
cd frontend
pnpm install
pnpm dev
```

The app runs in Vite and connects to the backend API using the configured frontend URL and auth flow.

## Key folders

- `src/App.tsx` — root app wrapper
- `src/routes/AppRoutes.tsx` — route definitions
- `src/features/store-front/` — storefront pages and flows
- `src/features/back-office/` — admin dashboard and management screens
- `src/features/notifications/` — real-time notification UI
- `src/lib/` — API client, socket, and shared helpers

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

## Notes

This frontend is designed to work with the backend API and shared service layer. You should run the backend and supporting infrastructure before using authenticated or order-related flows.
