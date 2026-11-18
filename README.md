# CardSaathi — Smart Credit Card Companion

**Every Transaction Understood. Every Rupee Tracked.**

CardSaathi is a responsive credit card awareness app with a React/Vite dashboard and an Express API backed by PostgreSQL and Prisma. It tracks cards using safe display data, helps organize transactions and payment reminders, and explains credit concepts in plain language.

## Included

- Registration and login with bcrypt password hashing and signed JWTs.
- Responsive dashboard with simple and advanced modes, spending charts, category breakdown, and a payment reminder.
- Card and transaction CRUD APIs with per-user ownership checks; UI for adding cards and transactions, removing transactions, search, category filtering, CSV import/export.
- Payment records and manual paid status. These are simulated and never bank-confirmed.
- Rule-based insights and a financial assistant grounded in the signed-in user's records for account-specific questions.
- English, Hindi, Telugu, and Gujarati preference fields; browser speech input/output when supported.
- Admin-only usage summary and user-list API; admin routes expose no card or transaction details.
- PostgreSQL schema, indexes, category seed, rate limiting, Helmet, CORS, validation, and an IST daily reminder job with Socket.IO notifications.

Dashboard figures are sample demonstration values, not bank data. CardSaathi does not connect to banks or process payments. Cloudinary upload support, email delivery for password resets, an external AI provider, and Redis-backed queues are not connected in this starter.

## Requirements and local setup

Requires Node.js 20+ and PostgreSQL 14+.

1. Install packages: `npm install`, `npm install --prefix server`, and `npm install --prefix client`.
2. Copy `server/.env.example` to `server/.env`, then set `DATABASE_URL` and a long random `JWT_SECRET`.
3. Stop the dev server, then sync the Prisma schema and seed standard categories:

   ```sh
   npm run db:push --prefix server
   npm run db:seed --prefix server
   ```

   The script uses the Prisma 6 CLI installed under `server`; avoid running `npx prisma` from the repository root, which can download a different CLI. `db:push` is for local development. Create and commit migration files before production deployment.

4. Optionally set `client/.env` to `VITE_API_URL=http://localhost:4000/api` (the default).
5. Run `npm run dev`; web is at `http://localhost:5173`, API at `http://localhost:4000`.

## Environment variables

| Variable | Service | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | API | PostgreSQL connection string (Neon supports pooled URLs) |
| `JWT_SECRET` | API | Private signing key; use a secret manager in production |
| `CLIENT_ORIGIN` | API | Exact browser origin allowed by CORS |
| `PORT` | API | HTTP port, defaults to 4000 |
| `REDIS_URL` | API | Reserved for future durable queue/cache |
| `VITE_API_URL` | Web | Public API base URL, such as `https://api.example.com/api` |

## Deployment

- **Vercel:** set root to `client`, build `npm run build`, output `dist`, set `VITE_API_URL`.
- **Render:** set root to `server`, build `npm install && npx prisma generate`, start `npm start`, configure `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV=production`.
- **Neon:** configure `DATABASE_URL`, then run `npx prisma migrate deploy` and `node prisma/seed.js` from the server directory.
- Use HTTPS, rotate secrets, restrict CORS, and move reminder scheduling to a durable single worker before running multiple API instances.

## Security boundaries

Only card name, network, last four digits, credit limit, and optional billing days belong in the card record. Never send or store complete card numbers, CVV, PIN, or OTP. JWTs are held in browser local storage in this MVP; production should consider secure HttpOnly SameSite cookies and CSRF protection. Account recovery currently returns a non-enumerating response but sends no email.

## API docs

See [API.md](API.md). Protected routes require `Authorization: Bearer <JWT>`.
