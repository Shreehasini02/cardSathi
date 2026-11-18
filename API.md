# CardSaathi REST API

Base URL: `/api`. JSON requests and responses. Protected routes require `Authorization: Bearer <JWT>`.

## Authentication

- `POST /auth/register` — `{ "name": "Aarav Mehta", "email": "aarav@example.com", "password": "at-least-8-chars", "language": "en", "dashboardMode": "simple" }`
- `POST /auth/login` — `{ "email": "aarav@example.com", "password": "…" }`
- `POST /auth/forgot-password` — `{ "email": "aarav@example.com" }` (generic response; email delivery is not configured)
- `GET /me` — signed-in account profile.
- `PATCH /me/preferences` — `{ "language": "hi", "dashboardMode": "advanced" }`.

## Credit cards

- `GET /cards`
- `POST /cards` — `{ "name": "HDFC Millennia", "last4": "4829", "creditLimit": 150000, "network": "VISA", "billingDay": 1, "dueDay": 24 }`
- `PATCH /cards/:id` — partial update using safe fields.
- `DELETE /cards/:id`

## Transactions

- `GET /transactions?category=Food&search=coffee&from=2026-11-01&to=2026-11-30&cardId=…`
- `POST /transactions` — `{ "merchant": "Amazon", "amount": 2499, "category": "Shopping", "date": "2026-11-16", "cardId": "…" }` (the card must belong to the user; a card name can be used instead of `cardId`).
- `PATCH /transactions/:id` — partial transaction update.
- `DELETE /transactions/:id`

## Payments, insights, and admin

- `GET /payments`; `POST /payments` — `{ "cardId": "…", "amount": 12480, "dueDate": "2026-11-24" }`; `PATCH /payments/:id/paid` updates the simulated record only.
- `GET /insights` — current-month totals and observations from saved transactions.
- `POST /assistant` — `{ "question": "Where did most of my money go?" }`; response says whether account records informed the answer.
- `GET /health` — service liveness.
- Admin role only: `GET /admin/overview`, `GET /admin/users`. User listing contains account metadata and record counts, not financial details.
