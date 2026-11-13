import { beforeEach, describe, expect, it, vi } from "vitest";

const update = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    integrationEvent: {
      findUnique: vi.fn().mockResolvedValue({ id: 7, status: "pending", kind: "email_admin" }),
      update
    }
  }
}));
vi.mock("@/lib/booking-payload", () => ({ getBookingPayload: vi.fn().mockResolvedValue({ id: 42 }) }));
vi.mock("@/lib/email", () => ({
  sendAdminNotification: vi.fn().mockRejectedValue(new Error("Resend unavailable")),
  sendClientConfirmation: vi.fn()
}));
vi.mock("@/lib/retry", () => ({ withRetry: (operation: () => Promise<unknown>) => operation() }));
vi.mock("@/lib/telegram", () => ({ sendTelegramNotification: vi.fn() }));
vi.mock("@/lib/crm", () => ({ getCrmAdapter: vi.fn() }));

describe("integration logging", () => {
  beforeEach(() => update.mockClear());

  it("records final admin email failure without changing a booking", async () => {
    const { processIntegration } = await import("@/lib/integrations");
    await expect(processIntegration(42, "email_admin")).rejects.toThrow("Resend unavailable");
    expect(update).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: "failed", lastError: "Resend unavailable" })
    }));
  });
});
