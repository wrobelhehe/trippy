# Quickstart: Travel Memory Album

## Prerequisites

- Node.js 20.x
- Supabase project(s) for DEV and PROD
- Stripe account (test + live)
- Gemini API key

## Environment Variables

Create `.env.local` in `/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
GEMINI_API_KEY=
SENTRY_DSN=
```

## Install & Run

```bash
npm install
npm run dev
```

## Database Migrations

Migrations live in:

```
/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/migrations
```

Apply them via your Supabase workflow (CLI or dashboard). Production migrations should be executed only after approval.

## Edge Functions

Deploy Supabase Edge Functions from:

```
/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/functions
```

## Webhooks

Configure Stripe webhook endpoint to the deployed Edge Function URL and set `STRIPE_WEBHOOK_SECRET`.
