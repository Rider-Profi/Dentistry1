import { z } from "zod";
import { isBookableSlot, isCalendarDate, londonToday } from "@/lib/booking-time";
import { isValidUkPhone } from "@/lib/phone";

const text = (message: string) => z.string({ error: message });

export const bookingServiceSchema = z.object({
  serviceSlug: text("Choose a treatment to get started.").min(1, "Choose a treatment to get started.").max(100, "Please choose a treatment from the list."),
  doctorSlug: text("Please choose a dentist from the list.").max(100, "Please choose a dentist from the list.").optional().or(z.literal(""))
});

export const bookingScheduleSchema = z.object({
  date: text("Choose a valid date.").refine(isCalendarDate, "Choose a valid date.")
    .refine((date) => isCalendarDate(date) && date >= londonToday(), "Choose today or a future date."),
  time: z.enum(["morning", "afternoon", "evening"], { message: "Choose a time of day that suits you." })
}).refine(({ date, time }) => isBookableSlot(date, time), {
  path: ["time"], message: "That time has already passed. Please choose a later time or another day."
});

export const bookingContactSchema = z.object({
  name: text("Please enter your name.").trim().min(2, "Please enter your name (at least 2 characters).")
    .max(80, "Please keep your name to 80 characters or fewer.")
    .refine((name) => /\p{L}/u.test(name) && !/[<>]/.test(name), "Please enter your name without angle brackets."),
  phone: text("Please enter a UK phone number.").max(40, "Please check your phone number.").refine(isValidUkPhone,
    "Enter a UK mobile (07) or landline (01 or 02), or use +44 instead of the first 0."),
  email: text("Please enter a valid email address, or leave this blank.").trim()
    .max(160, "Please keep your email address to 160 characters or fewer.")
    .refine((value) => value === "" || z.string().email().safeParse(value).success, "Please enter a valid email address, or leave this blank.").optional(),
  comment: text("Please enter your note as text.").trim().max(500, "Please keep your note to 500 characters or fewer.").optional(),
  consent: z.literal(true, { error: "Please confirm that we may contact you about your request." })
});

export const bookingSchema = z.object({
  idempotencyKey: z.string().uuid("Please refresh the page and try again.")
}).and(bookingServiceSchema).and(bookingScheduleSchema).and(bookingContactSchema);
