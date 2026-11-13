import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bookingSchema, priceSchema } from "@/lib/validations";
import { normalizePhone, sanitizeText } from "@/lib/utils";
import { isValidUkPhone } from "@/lib/phone";

const validBooking = {
  idempotencyKey: "79d0f9a2-5692-47ec-b6de-56a7087346cb",
  serviceSlug: "terapiya",
  doctorSlug: "",
  date: "2026-07-15",
  time: "morning",
  name: "Alex Taylor",
  phone: "07700 900123",
  email: "",
  comment: "",
  consent: true
};

describe("booking validation", () => {
  it("rejects a zero upper fee when the starting fee is positive", () => {
    expect(priceSchema.safeParse({ serviceId: 1, name: "White filling", priceFrom: 180, priceTo: 0 }).success).toBe(false);
  });
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-06-15T08:00:00Z")); });
  afterEach(() => vi.useRealTimers());
  it("accepts a complete booking without email", () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("rejects incomplete phone and missing consent", () => {
    expect(bookingSchema.safeParse({ ...validBooking, phone: "07700", consent: false }).success).toBe(false);
  });

  it.each([
    ["07700 900123", "+447700900123"], ["+44 7700 900123", "+447700900123"],
    ["0044 7700 900123", "+447700900123"], ["+44 (0)7700 900123", "+447700900123"],
    ["020 7946 0123", "+442079460123"], ["01632 960123", "+441632960123"],
    ["01697 71234", "+44169771234"]
  ])("normalises %s to E.164", (phone, expected) => {
    expect(normalizePhone(phone)).toBe(expected);
    expect(bookingSchema.safeParse({ ...validBooking, phone }).success).toBe(true);
  });

  it.each(["", "+7 9991234567", "07012345678", "07612345678", "03001234567", "08001234567", "0207946012", "077009001234", "447700900123", "+4407700900123", "07700abc900123", "++447700900123"])("rejects invalid or unsupported phone %s", (phone) => {
    expect(isValidUkPhone(phone)).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, phone }).success).toBe(false);
  });

  it.each([
    { date: "2026-02-30" }, { date: "2026-06-14" }, { date: "not-a-date" },
    { email: "alex@" }, { name: " " }, { comment: "x".repeat(501) }, { consent: false }, { time: "утро" }
  ])("rejects invalid fields: %o", (fields) => {
    expect(bookingSchema.safeParse({ ...validBooking, ...fields }).success).toBe(false);
  });

  it("rejects a period that ended in London, even when UTC is an hour behind", () => {
    vi.setSystemTime(new Date("2026-06-15T11:00:00Z"));
    expect(bookingSchema.safeParse({ ...validBooking, date: "2026-06-15" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, date: "2026-06-15", time: "afternoon" }).success).toBe(true);
  });

  it("removes HTML delimiters from free text", () => {
    expect(sanitizeText("<b>Note</b>")).toBe("bNote/b");
  });
});
