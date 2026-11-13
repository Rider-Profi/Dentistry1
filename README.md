# SmileCare Dental Studio

**Demo Portfolio Project** — a UK English dental practice website with appointment requests and a protected administration area. Built to demonstrate responsive interface design, typed validation, server-side persistence and deployment workflows.

> SmileCare Dental Studio is a fictional brand. All practice details, clinicians, qualifications, patient stories and fees are invented for portfolio purposes. This is not a healthcare service and does not provide medical advice, diagnosis or treatment. No real appointments can be booked. Use fictitious details when testing; submitted form data is actually stored in the configured database.

## Tech stack

| Area | Technology |
| --- | --- |
| Application | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 3, Lucide icons, local SVG avatars |
| Database | PostgreSQL, Prisma ORM 5.22, versioned SQL migrations |
| Authentication | NextAuth.js 4 credentials provider, bcrypt password hashes |
| Validation and dates | Zod 4, date-fns, date-fns-tz, React DayPicker |
| Spreadsheets | ExcelJS import and export |
| Optional services | Upstash Redis/QStash, Resend or SMTP, Telegram, Cloudinary, AmoCRM |
| Quality checks | ESLint, TypeScript, Vitest, GitHub Actions |
| Hosting target | Vercel with a managed PostgreSQL database |

## Features and architecture

- Mobile-first treatment, fee, dentist and review pages with British English copy and GBP formatting.
- A three-step appointment request form, available as a page or keyboard-accessible modal.
- Shared browser/server validation for supported UK mobile and landline numbers; normalisation to E.164.
- Appointment dates interpreted in `Europe/London`, including GMT/BST changes. Time periods are preferences, not live availability or reserved slots.
- Branded inline calendar with fixed British English labels and Monday-first weeks, independent of the browser locale. Selected dates are submitted as `YYYY-MM-DD` and validated again on the server.
- Idempotent booking creation and separately recorded notification outcomes.
- Authenticated request management, dentist profile editing and fee import/export.
- Privacy information, visible portfolio disclaimers and a Google Maps link without an embedded tracker.

Public catalogue content currently comes from `prisma/seed-data.ts` through `lib/content.ts`. The administration area and APIs use PostgreSQL. Admin edits persist in the database but do **not** automatically republish the static public catalogue. Update the catalogue source and redeploy for public content changes; run the seed command to align demonstration database records. Keep treatment and dentist slugs consistent so booking validation can resolve them.

## Local setup

Use Node.js **22 or 24** and npm. You also need a PostgreSQL database, either local or hosted on Neon/Supabase. Run all commands in the directory containing `package.json`.

```bash
npm install
```

Create the environment file if it does not already exist:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS / Linux alternative
cp .env.example .env
```

Edit `.env`: configure both database URLs, an authentication secret, `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters. The example database credentials only work if you create that local database yourself. Generate an authentication secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Initialise the database and start the application:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run db:admin
npm run dev
```

Open `http://localhost:3000` and sign in at `http://localhost:3000/admin/login` using the account you configured. There are no published default credentials. `db:admin` creates or resets that administrator account; `db:seed` populates the fictional catalogue and reviews.

Use `npm ci` instead of `npm install` when reproducing the committed lockfile in CI or a clean checkout. Never commit `.env` files, database passwords or administrative credentials.

## Database configuration: Neon or Supabase

This repository uses **Prisma 5**, with `url` and `directUrl` in `prisma/schema.prisma`. Do not replace this configuration with Prisma 7 examples from newer provider quickstarts.

| Provider | `DATABASE_URL` — application queries | `DIRECT_URL` — migrations |
| --- | --- | --- |
| Neon | Pooled connection from the provider dashboard | Direct/unpooled connection to the same database |
| Supabase | Transaction pooler, normally port 6543; add `pgbouncer=true` for this Prisma client | Direct connection, or session pooler on port 5432 if direct IPv6 access is unavailable |
| Local PostgreSQL | Local database connection | The same local connection is suitable |

Copy the exact host, user, database and password from your provider. Retain the provider's TLS options, normally `sslmode=require`, and URL-encode special characters in passwords. For serverless Prisma 5 clients, `connection_limit=1` is a conservative starting point; adjust it to your database capacity. Append additional URL parameters with `&` when a query string already exists.

Both URLs must target the same database. Use a separate database or branch for preview deployments. For Supabase, this application connects directly through Prisma; it does not need a Supabase browser key. Keep application tables inaccessible to anonymous Data API clients (disable the unused Data API or configure appropriate permissions/RLS).

Provider references: [Neon and Prisma](https://neon.com/docs/guides/prisma), [Supabase and Prisma](https://supabase.com/docs/guides/database/prisma).

## Environment variables

`.env.example` contains every application-specific key. Next.js and Prisma read the local `.env`; Vercel values must also be entered in the project's environment settings. Variables prefixed `NEXT_PUBLIC_` are public and must never contain credentials.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL runtime connection; required for bookings and administration. |
| `DIRECT_URL` | Migration connection to the same database; required by the Prisma schema. |
| `NEXTAUTH_SECRET` | Unique random secret for signing/encrypting authentication tokens. |
| `NEXTAUTH_URL` | Application origin, e.g. `http://localhost:3000` locally; HTTPS deployment origin on Vercel. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by `npm run db:admin`; not required as Vercel runtime variables. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, email links and QStash callbacks; omit a trailing slash. |
| `NEXT_PUBLIC_CLINIC_PHONE` | Display telephone number; the supplied UK number is fictional. |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Optional real, monitored contact for the portfolio owner. Leave blank if unavailable. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared booking rate limits; recommended for a publicly accessible deployment. |
| `QSTASH_TOKEN` | Publishes notification jobs to QStash. |
| `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` | Verify queued requests; configure both alongside the token. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional notification delivery to a bot/chat you control. |
| `EMAIL_PROVIDER` | `resend` (default) or `smtp`; there is no automatic provider failover. |
| `RESEND_API_KEY` | Required when using Resend delivery. |
| `EMAIL_FROM` | Verified sending address. |
| `EMAIL_ADMIN_TO` | Comma-separated administrative notification recipients. |
| `EMAIL_REPLY_TO` | Optional monitored reply address. |
| `SMTP_HOST`, `SMTP_PORT` | SMTP server and port; used only with `EMAIL_PROVIDER=smtp`. |
| `SMTP_SECURE` | `true` for implicit TLS (usually 465); `false` for STARTTLS (usually 587). |
| `SMTP_USER`, `SMTP_PASS` | SMTP authentication credentials. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional image uploads and cleanup; not needed for bundled avatars. |
| `CRM_TYPE` | `amocrm`; no other adapter is currently implemented. |
| `CRM_API_URL`, `CRM_API_TOKEN` | Optional AmoCRM endpoint and access token. |
| `CRM_RESPONSIBLE_USER_ID` | Optional responsible user ID for CRM leads. |

Without Redis, rate limiting is in memory and applies only to one process. Configure Redis for shared limits across Vercel instances.

Without QStash, notification attempts run synchronously. Unconfigured providers produce failed integration records; they do not undo a saved appointment request. This fallback is useful locally but can delay responses. Configure QStash and the intended delivery providers for a full hosted integration demonstration. Its callback origin must be publicly reachable; deployment protection must allow authenticated QStash delivery. Production job endpoints reject unsigned requests when signing keys are missing.

Only send test notifications to accounts you control. Notification delivery is not a confirmed appointment. Cloudinary uploads are optional: new profiles can retain a local illustrated avatar.

## Administration and spreadsheets

- `/admin`: request counts and recent activity.
- `/admin/bookings`: search, status filtering and XLSX export.
- `/admin/bookings/[id]`: request details, status updates and integration outcomes.
- `/admin/doctors`: create, edit and hide demonstration profiles.
- `/admin/prices`: edit fees, export a template, preview an import and confirm valid rows.

Price workbook columns are `Treatment`, `Fee`, `Category`, `Description`, `From (£)`, `To (£)` and `Unit`. Amounts are numeric pounds, without currency symbols in cells. `To (£)` may be blank. A fee must not end below its starting amount. The optional `Fee` column distinguishes multiple prices under one treatment; without it, the treatment name becomes the fee name. Legacy Russian headers are still accepted for existing workbooks. Imports accept `.xlsx` files up to 2 MB.

The seed is repeatable but intentionally refreshes recognised demonstration records. Do not run it automatically on every deployment or against unrelated production data. Existing legacy dentist URLs redirect to the UK profiles.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`build` generates Prisma Client before compiling Next.js. GitHub Actions runs linting, type checking, tests, migrations, seeding and a production build against a temporary PostgreSQL service. No external notification credentials are required for unit tests.

For browser review, check 320, 390, 768, 1024 and 1440 px widths, all booking steps, validation messages, keyboard navigation and the administration editor. Wide administrative tables deliberately scroll within their own labelled region. Check long names, email addresses and notes as well as the default content.

Run `npm audit` when preparing a release. The final local audit found no high or critical advisories, with 11 remaining low/moderate findings in email-rendering and development-tool dependency chains. This is not a claim of a completed security audit. Compatibility overrides pin a patched Nodemailer for the credentials-only NextAuth setup and a patched legacy brace-expansion version; review these when upgrading dependencies or adding email-based authentication.

## Deploy to Vercel

1. Create an empty, dedicated Neon/Supabase database and configure `.env` locally as described above.
2. Run client generation, `prisma migrate deploy`, `db:seed` and `db:admin` against that database. Check the site locally, then run all verification commands.
3. Push the source, `package-lock.json`, `.env.example` and `prisma/migrations` to GitHub. Keep `.env`, `.next`, `node_modules` and `.vercel` out of Git.
4. Import the GitHub repository into Vercel. Select the directory containing `package.json` as the Root Directory, choose the Next.js preset and use Node.js 22 or 24.
5. Set Install Command to `npm ci`, Build Command to `npm run build`, and leave Output Directory at the framework default.
6. Add both database URLs, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` in Vercel. Use the final HTTPS origin for both URL settings. Add optional service keys only for integrations you are configuring.
7. Deploy. If the final URL was not known beforehand, update both origins after the first deployment and redeploy. Public environment values are compiled into the client bundle.
8. Verify sign-in, a fictitious booking, its persisted admin record, and any configured notification deliveries on the deployed site.

The build intentionally does **not** migrate or seed the database. For subsequent releases, run `npx prisma migrate deploy` in a controlled release step before deploying code that depends on a new schema. Never use `prisma migrate reset` or `prisma db push` as a production deployment step.

See [Vercel environment settings](https://vercel.com/docs/environment-variables/managing-environment-variables). A successful local production build verifies compilation; hosted database connectivity and third-party delivery still require a deployment smoke test.

## Project layout

```text
app/          Public pages, admin routes and API handlers
components/   Public UI, booking form, admin controls and modal primitives
lib/          Validation, London time handling, persistence and integrations
prisma/       Schema, migrations and fictional seed content
public/       Local images and illustrated avatars
emails/       Notification templates
tests/       Unit and API regression tests
docs/        Demo content notes, pricing references and release verification
```

See `docs/demo-content.md` and `docs/demo-pricing.md` for content decisions. Before adapting this demonstration for a real practice, replace the fictional material, connect the intended content publishing workflow and establish the operator's privacy, retention and healthcare requirements.
