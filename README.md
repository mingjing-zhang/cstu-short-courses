# CSTU Short Courses — a platform for selling live AI courses

A small but complete course-selling platform: a marketing **landing page**, an
**AI course advisor**, full-stack **APIs**, a working **enroll/checkout** flow,
a **referral** mechanic, and an **admin** back office.

It brings together skills from two CSTU courses:

- **CSE642** — the frontend landing page + the AI advisor integration
- **CSE552** — the full-stack API routes, data store, and admin back office

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

That's it — no database, no API keys, no accounts to set up. Enrollments are
saved to a local JSON file (`data/store.json`).

## What to try

1. **Home** — scroll to **AI Course Advisor**, click a sample prompt (or type
   your own goal in any language). It recommends a course with a personalized pitch.
2. **Enroll** — pick a course, fill in an email, "pay" (demo, no card charged).
3. **Admin** (`/admin`) — sign in with the demo password `lovecstu1234`, then see
   the enrollment you just made show up with live revenue stats and referral
   attribution.
4. **Referral link** — open `http://localhost:3000/?r=jimmy`. A discount banner
   appears, and any enrollment is attributed to `jimmy` in the admin.

## The AI part (CSE642)

The advisor lives at `app/api/advisor/route.ts`.

- **Out of the box** it uses a built-in rule-based recommender, so it
  always works with zero setup.
- **Make it live**: copy `.env.example` to `.env.local`, add an
  `ANTHROPIC_API_KEY`, and restart. The advisor then calls Claude and writes a
  genuinely personalized pitch in the visitor's own language. The badge under
  the result switches from "Sample recommendation" to "Personalized by Claude".

## How it maps to a real product

This build deliberately stubs the parts that need real infrastructure, and the
code notes where:

| This build | Production |
| --- | --- |
| JSON-file store | Postgres / SQLite + an ORM |
| "Pay (demo)" button | Stripe Checkout + webhook |
| `/admin` behind a shared password (`lovecstu1234`) | Staff email login + role gate |
| No emails sent | Resend / Postmark for receipts & codes |

## Project layout

```
app/
  page.tsx            landing page (server component)
  enroll/page.tsx     checkout
  admin/page.tsx      back office (client, live data)
  api/
    courses/          GET course catalog
    enroll/           POST a new enrollment
    customers/        GET enrollments + stats (admin)
    advisor/          POST a goal -> recommended course (Claude or rules)
components/           Advisor, EnrollForm, header/footer, referral capture
lib/
  courses.ts          course catalog (seed data)
  store.ts            JSON-file persistence
```
