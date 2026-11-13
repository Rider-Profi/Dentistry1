import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { enGB } from "date-fns/locale";
import { siteConfig } from "@/lib/site-config";

export const bookingTimeSlots = [
  { value: "morning", label: "Morning", range: "9am–12pm", endHour: 12 },
  { value: "afternoon", label: "Afternoon", range: "12pm–5pm", endHour: 17 },
  { value: "evening", label: "Evening", range: "5pm–9pm", endHour: 21 }
] as const;

export function londonToday(now = new Date()) {
  return formatInTimeZone(now, siteConfig.timeZone, "yyyy-MM-dd");
}

export function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isBookableSlot(date: string, time: string, now = new Date()) {
  const slot = bookingTimeSlots.find((item) => item.value === time);
  if (!slot || !isCalendarDate(date)) return false;
  const today = londonToday(now);
  return date > today || (date === today && Number(formatInTimeZone(now, siteConfig.timeZone, "H")) < slot.endHour);
}

export function bookingDateToUtc(date: string) {
  if (!isCalendarDate(date)) throw new RangeError("Invalid booking date");
  // Store the preferred calendar date at London noon, away from DST transitions.
  // This is not a confirmed appointment time; preferTime holds the requested period.
  return fromZonedTime(`${date}T12:00:00`, siteConfig.timeZone);
}

export function formatBookingDate(date: string | Date) {
  const instant = typeof date === "string" && isCalendarDate(date) ? bookingDateToUtc(date) : date;
  return formatInTimeZone(instant, siteConfig.timeZone, "d MMMM yyyy", { locale: enGB });
}

export function formatLondonDateTime(date: string | Date) {
  return formatInTimeZone(date, siteConfig.timeZone, "d MMM yyyy, HH:mm zzz", { locale: enGB });
}

export function formatBookingTime(value: string | null) {
  // Keep requests created before localisation readable without rewriting patient records.
  const legacy: Record<string, string> = { "утро": "morning", "день": "afternoon", "вечер": "evening" };
  const slot = bookingTimeSlots.find((item) => item.value === (legacy[value || ""] || value));
  return slot ? `${slot.label}, ${slot.range} (London time)` : "To be arranged";
}
