import aliases from "./doctor-aliases.json";

// Shared by data migration, booking compatibility and Next.js redirects.
export const legacyDoctorSlugs: Readonly<Record<string, string>> = Object.freeze(
  Object.assign(Object.create(null), aliases)
);
