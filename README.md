# Ember

A calorie deficit visualizer. Set a weight loss goal, log your days, and watch the numbers burn down.


Its dashboard look like: 

![ember_dashboard](/public/ember1.png)

![ember_activity](/public/ember2.png)


The dashboard to log calories looks like: 
![ember_log](/public/ember3.png)


## Stack

- **Next.js 16** — App Router
- **Clerk** — Auth
- **Neon** — Postgres
- **Prisma 7** — ORM
- **shadcn/ui + Tailwind** — UI
- **Vercel** — Deployment

## Getting started

```bash
git clone https://github.com/bhavv04/ember
cd ember
npm install
npm run dev
```

## Environment variables

Create a `.env` file in the root with the following:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Then push the schema:

```bash
npx prisma db push
npx prisma generate
```