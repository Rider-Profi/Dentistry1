const phone = process.env.NEXT_PUBLIC_CLINIC_PHONE || "+44 1632 960000";

export const siteConfig = {
  name: "SmileCare Dental Studio",
  shortName: "SmileCare",
  descriptor: "Dental Studio",
  locale: "en-GB",
  openGraphLocale: "en_GB",
  currency: "GBP",
  timeZone: "Europe/London",
  description:
    "Dental care built around you. Explore your treatment options, understand the costs and take the next step towards a healthier smile.",
  // Default number is from Ofcom's reserved range for fictional use.
  phone,
  phoneHref: `tel:${phone.replace(/[^+\d]/g, "")}`,
  hours: "Monday–Sunday, 9am–9pm",
  address: "123 Baker Street, London, W1U 6RT",
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("123 Baker Street, London, W1U 6RT")}`,
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() || "",
  demoDisclaimer: "SmileCare Dental Studio is a fictional brand created for portfolio purposes. All practice details, clinician profiles, patient stories and fees are fictional examples. This website does not provide medical advice, diagnosis or treatment, and no real appointments can be booked."
} as const;
