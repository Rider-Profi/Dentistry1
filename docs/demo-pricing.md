# Demonstration fee guide

SmileCare Dental Studio is a fictional portfolio practice. These amounts are illustrative GBP fees, not a quotation or an offer of dental treatment. They are not a currency conversion of the original Russian price list.

## Research

Public fee guides reviewed on 7 November 2026:

- [The Ivory Dental Studio, Marylebone](https://theivorydentalstudio.co.uk/fee-guide/): hygiene with Airflow £99; composite fillings from £145; root canal treatment from £450–£550 depending on the tooth; implant and crown from £2,500; orthodontic fees vary by system.
- [Augustus Road Dental, London](https://www.augustusdental.co.uk/fees/private-fees/): advanced hygiene £100; composite fillings from £250; root canal treatment from £670; in-house whitening £650; implant including crown from £2,500; aligners from £2,750–£3,500; extractions from £220, or £310 for surgical removal.

The figures below are editorial estimates chosen for a coherent demonstration catalogue, rather than a claim about average London prices. Individual clinics differ in assessment fees, specialist involvement, complexity and what is included.

| Treatment | Demo guide fee | Basis |
| --- | --- | --- |
| Tooth-coloured filling | From £195 | Per tooth |
| Root canal treatment | £650–£950 | Per tooth; final crown separate |
| Hygiene with Airflow | From £99 | 45-minute visit |
| In-practice whitening | From £595 | Upper and lower teeth, subject to suitability |
| Implant placement | From £1,700 | Crown separate; scans or grafting may cost extra |
| Implant crown and abutment | From £995 | Combined placement and crown start at £2,695 |
| Metal braces | From £2,500 | One arch, routine adjustments included; retainers separate |
| Clear aligners | £3,000–£5,000 | Two arches; routine reviews included; retainers separate |
| Routine extraction | From £195 | Per tooth |
| Surgical wisdom tooth removal | £350–£650 | Per tooth; sedation separate |

## Data and booking conventions

- The catalogue is defined in `prisma/seed-data.ts`. Service slugs remain stable. Legacy dentist profile URLs redirect to the fictional British profiles; the seed preserves dentist database IDs and booking relationships when renaming them.
- Run `npm run db:seed` after deploying the updated source. The seed updates the known legacy demo price rows by ID; it does not delete bookings or custom prices. Running it again does not create duplicate English demo fees.
- Dates and preferred periods are evaluated in `Europe/London`. The database stores the preferred calendar date at London noon, converted to UTC with the correct GMT/BST offset. This timestamp is not a confirmed appointment time.
- Phone validation checks UK geographic/mobile format and normalises it to `+44`. It does not verify that a number is allocated or reachable. `070` personal numbers and `076` paging numbers are not accepted as UK mobile contact numbers. Example numbers are fictional.
- A request is acknowledged, not automatically confirmed. The same request key is reused for an unchanged retry after a connection failure.
- The English [README](../README.md) covers the stack, local setup, environment variables, database seeding, integrations, verification, Vercel deployment and the fictional nature of all demonstration data and branding.
