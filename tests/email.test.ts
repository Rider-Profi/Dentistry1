import { describe, expect, it, vi } from "vitest";

vi.mock("@/emails/admin-notification", () => ({ AdminNotificationEmail: () => null }));
vi.mock("@/emails/client-confirmation", () => ({ ClientConfirmationEmail: () => null }));

const booking = {
  id: 42,
  publicId: "booking-public-id",
  name: "Alex Taylor",
  phone: "+44 7700 900123",
  normalizedPhone: "+447700900123",
  email: null,
  serviceName: "Teeth Whitening",
  doctorName: "No preference",
  date: "15 June 2026",
  dateIso: "2026-06-15T11:00:00.000Z",
  time: "Morning, 9am–12pm (London time)",
  comment: null,
  createdAt: "9 Jun 2026, 14:32 BST",
  source: "website"
};

describe("email behavior", () => {
  it("skips client confirmation when email is absent", async () => {
    const { sendClientConfirmation } = await import("@/lib/email");
    await expect(sendClientConfirmation(booking)).resolves.toEqual({ skipped: true });
  });

  it("surfaces an admin delivery failure without a configured provider", async () => {
    const { sendAdminNotification } = await import("@/lib/email");
    const previous = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    process.env.EMAIL_PROVIDER = "resend";
    await expect(sendAdminNotification(booking)).rejects.toThrow("RESEND_API_KEY");
    process.env.RESEND_API_KEY = previous;
  });
});
