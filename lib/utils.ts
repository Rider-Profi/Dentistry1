import { siteConfig } from "@/lib/site-config";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const priceFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatPrice(value: number | string) {
  return priceFormatter.format(Number(value));
}

export { normalizePhone } from "@/lib/phone";

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}
