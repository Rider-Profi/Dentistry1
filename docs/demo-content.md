# Fictional portfolio content

The public team profiles, illustrated avatars, patient stories, star ratings, sample dates, practice details and fees are fictional. They must not be presented as genuine clinical credentials, endorsements or promises of treatment outcomes.

## Artwork and profiles

- The three original, locally hosted SVG avatars live in `public/avatars/`. They do not depict real people and do not require an external image service.
- Profiles use Dr Emily Smith, Dr James Wilson and Dr Olivia Brown. Educational background and development interests are explicitly illustrative; no real university, professional registration number or qualification is asserted.
- The shared alias map in `prisma/doctor-aliases.json` supports permanent URL redirects, old booking links and safe seed updates. Doctor database IDs and existing booking relationships are preserved.
- The seed replaces only recognised original sample reviews. Other review records are left unchanged. Re-running the seed does not create duplicate sample reviews.

## Location

123 Baker Street, London, W1U 6RT is an illustrative setting, not a SmileCare practice. Do not describe the address as a place patients can visit. The Google Maps link searches for the address without identifying it as a business; it follows the [documented Maps URL format](https://developers.google.com/maps/documentation/urls/get-started). The decorative street illustration is not an accurate map.

## Privacy information

The privacy page describes the implemented demo: optional contact fields, database storage, notification integrations, rate limiting, authentication cookies, external links and the absence of automatic deletion of booking records. Fictional branding does not anonymise real information submitted by a visitor.

The structure takes account of the [ICO guidance on the right to be informed](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/), but the page does not claim that an unspecified deployment is compliant with data protection law.

Before collecting real personal information, the operator must identify themselves and their actual providers, purposes, lawful bases, retention periods and relevant transfer arrangements. Set `NEXT_PUBLIC_PRIVACY_EMAIL` to a real, monitored owner contact when available. If unset, the page directs visitors to the portfolio owner's originating profile or listing rather than inventing a clinic mailbox.

The English [README](../README.md) documents the fictional content, local SVG assets, seed/redirect behaviour, optional privacy contact, local setup and deployment instructions.
