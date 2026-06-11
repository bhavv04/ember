![ember](/public/ember.png)

# Ember 

A calorie deficit visualizer. Set a weight loss goal, log your days, and watch the number burn down.

**[ember.app](https://ember.app)** · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## Stack

- **Next.js 16** — App Router
- **Clerk** — Auth
- **Neon** — Postgres
- **Prisma 7** — ORM
- **shadcn/ui + Tailwind** — UI
- **Vercel** — Deployment

## Getting started

```bash
git clone https://github.com/yourusername/ember
cd ember
npm install
```

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

Push the database schema:

```bash
npx prisma db push
npx prisma generate
```

Run the dev server:

```bash
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

See `.env.example` for the full list.

## Status

🚧 In active development