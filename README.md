# OQanoon Research

OQanoon Research is a **Legal Research & Interpretation System** (informational only, not legal advice). The platform lets authenticated users search official legal texts, view linked executive regulations, generate structured explanations with citations, and chat with an AI assistant while retaining full conversation history.

> **Disclaimer:** Informational legal research tool. Not legal advice.

## ✨ Core Features

- Keyword + article number search with filters and ranked results.
- Article pages with three-column layout: official text, linked instruments, and AI explanations.
- Context-aware chat for articles, regulations, or global research threads.
- Conversation history logs with auto-generated titles.
- Admin ingestion for text, PDF, or OCR workflows with review/approval steps.
- Stripe subscriptions with trial gating.

## 🧱 Tech Stack

- **Frontend:** Next.js (TypeScript), Tailwind CSS
- **Backend:** Next.js API routes
- **Auth:** NextAuth credentials provider
- **DB:** PostgreSQL + Prisma
- **Payments:** Stripe (Checkout + webhooks)
- **OCR:** Placeholder abstraction for OCR ingestion

## ✅ Requirements

- Node.js 18+
- PostgreSQL

## 🔧 Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env`

```bash
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/oqanoon
NODE_ENV=development
NEXTAUTH_SECRET=changeme
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=changeme

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Run Prisma migrations + seed data

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Start the app

```bash
npm run dev
```

The seed creates:

- 1 law with 5 articles
- 1 regulation with 8 clauses
- 3 mappings
- 1 admin user: `admin@oqanoon.dev` / `admin1234`

## 🔑 Authentication

- Sign up via `/signup` (automatically enters a trial period).
- Login via `/login`.
- Admin routes require a user with `ADMIN` role.

## 💳 Stripe Subscriptions

- Plans are configured by Stripe price IDs.
- Checkout sessions are created at `/api/stripe/create-checkout-session`.
- Webhooks update subscription status at `/api/stripe/webhook`.

## 🧪 Tests

Basic tests are located in `src/tests` and can be run with:

```bash
node src/tests/search.test.mjs
node src/tests/mappings.test.mjs
node src/tests/chat.test.mjs
```

## 🐳 Docker (local)

```bash
docker build -t oqanoon-research .
docker run --env-file .env -p 3000:3000 oqanoon-research
```

## 🗂️ Routes

Public:

- `/`
- `/pricing`
- `/login`
- `/signup`

App:

- `/app/search`
- `/app/provision/:id`
- `/app/instrument/:id`
- `/app/chat`
- `/app/chat/:threadId`
- `/app/billing`

Admin:

- `/admin`
- `/admin/ingest`
- `/admin/instruments`
- `/admin/provisions`
- `/admin/mappings`
- `/admin/import`

## ⚖️ Compliance Guardrails

- The app includes a persistent disclaimer across pages.
- Official legal texts are displayed verbatim.
- AI explanations and chat responses are informational and citation-based.
- Case-specific legal advice is refused and redirected to licensed counsel.
