# Ember 

A calorie deficit visualizer. Not a calorie tracker — a tool that makes the math of weight loss visceral and concrete.

## What it does

- Set a weight loss goal and see the total calorie deficit required to reach it
- Log daily calories eaten and track your net deficit over time
- Weekly weigh-ins automatically recalibrate your TDEE
- Visual progress tracker showing how far you've climbed the mountain
- Activity equivalents — translates your remaining deficit into real-world effort (walking, treadmill, etc.)
- Timeline projection — estimates your goal date based on current pace

## Stack

- **Framework** — Next.js 15 (App Router)
- **Auth** — Clerk
- **Database** — Neon (Postgres)
- **ORM** — Prisma 7
- **UI** — shadcn/ui + Tailwind CSS
- **Deployment** — Vercel

## Getting started

```bash
npm install
```

Set up your `.env` file:

```env
DATABASE_URL=your_neon_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
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

## Status

🚧 In development