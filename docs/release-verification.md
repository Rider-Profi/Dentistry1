# Release verification — 8 November 2026

## Automated checks

- `npm run lint`: passed with no warnings.
- `npm run typecheck`: passed.
- `npm test`: 60 tests passed across seven files.
- `npm run build`: passed with Next.js 15.5.29; 33 static pages generated.
- `npm ci --dry-run --ignore-scripts`: lockfile resolution passed. This is not a separate clean installation test.
- `.env.example`: all 33 application configuration keys documented; no missing keys found by source comparison.
- `git diff --check`: passed. Environment secrets and generated TypeScript build information are excluded from version control.

## Browser verification

Headless Chrome checked the local production server against an isolated, disposable PostgreSQL-compatible PGlite database. The operator's configured database and external delivery accounts were not used.

The route inventory comprised 16 public pages (including every seeded treatment and dentist profile), six administration pages and a missing-page response. All were checked at 320, 390, 768, 1024 and 1440 CSS pixels.

155 page/state checks passed with no document-level horizontal overflow or browser runtime exceptions. These covered the administration drawer, profile editor, public mobile menu, booking modal steps and validation messages. Two additional checks covered the booking success screen with a long unbroken name at 320 and 1440 pixels; the success response was mocked to avoid sending notifications.

Functional checks passed for:

- Unauthenticated admin redirection and credentials sign-in.
- Escape dismissal and focus restoration in the profile editor.
- Fee editing, persistence after reload and restoration of the original value.
- Saving a dentist profile with its bundled SVG avatar.
- Malformed workbook error feedback without a page crash.
- Booking and fee XLSX downloads.
- Fee import preview and confirmed export/import round-trip without duplicate treatments or prices.

Long unbroken names, email addresses, notes and diagnostic messages were included in database fixtures. The mobile dashboard and editor screenshots were visually reviewed. Administrative tables intentionally scroll inside their own labelled regions.

## Deployment boundaries

- Local build and browser checks do not verify Neon/Supabase credentials, Vercel hosting, email delivery, Telegram, Cloudinary or CRM accounts. Run a deployment smoke test after configuring those services.
- The public catalogue is source-backed; administrative changes persist to PostgreSQL without automatically republishing the catalogue. This existing architecture is documented in the README.
- The dependency audit after updates reported no high/critical advisories and 11 low/moderate findings in email-rendering and development-tool dependency chains. Re-run the audit before deployment; advisory data can change.
- GitHub Actions now provisions PostgreSQL and runs migrations, seeding, linting, types, tests and the build. The hosted workflow has not been executed in this local session.
