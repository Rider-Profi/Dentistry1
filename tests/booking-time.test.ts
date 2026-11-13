import { describe, expect, it } from "vitest";
import { bookingDateToUtc, formatBookingDate, formatBookingTime, formatLondonDateTime, isBookableSlot, isCalendarDate, londonToday } from "@/lib/booking-time";

describe("London booking dates", () => {
  it.each([
    ["2026-01-15", "2026-01-15T12:00:00.000Z"],
    ["2026-07-15", "2026-07-15T11:00:00.000Z"],
    ["2026-03-28", "2026-03-28T12:00:00.000Z"],
    ["2026-03-29", "2026-03-29T11:00:00.000Z"],
    ["2026-10-24", "2026-10-24T11:00:00.000Z"],
    ["2026-10-25", "2026-10-25T12:00:00.000Z"]
  ])("stores London noon on %s with the correct GMT/BST offset", (date, utc) => {
    expect(bookingDateToUtc(date).toISOString()).toBe(utc);
    expect(londonToday(new Date(utc))).toBe(date);
  });

  it("uses the London calendar day around midnight", () => {
    expect(londonToday(new Date("2026-06-15T23:30:00Z"))).toBe("2026-06-16");
    expect(isBookableSlot("2026-06-15", "evening", new Date("2026-06-15T23:30:00Z"))).toBe(false);
  });

  it("formats dates and timestamps consistently", () => {
    expect(formatBookingDate("2026-07-15")).toBe("15 July 2026");
    expect(formatLondonDateTime("2026-07-15T12:00:00Z")).toBe("15 Jul 2026, 13:00 BST");
    expect(formatLondonDateTime("2026-01-15T12:00:00Z")).toBe("15 Jan 2026, 12:00 GMT");
    expect(formatBookingTime("утро")).toBe("Morning, 9am–12pm (London time)");
  });

  it("rejects impossible dates and expired periods", () => {
    expect(isCalendarDate("2026-02-29")).toBe(false);
    expect(isCalendarDate("2028-02-29")).toBe(true);
    expect(() => bookingDateToUtc("2026-04-31")).toThrow();
    expect(isBookableSlot("2026-06-15", "evening", new Date("2026-06-15T20:00:00Z"))).toBe(false);
    expect(isBookableSlot("2026-06-16", "morning", new Date("2026-06-15T20:00:00Z"))).toBe(true);
  });
});
