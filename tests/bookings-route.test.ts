import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

const mocks = vi.hoisted(() => ({
  existing: vi.fn(), service: vi.fn(), doctor: vi.fn(), create: vi.fn(), events: vi.fn(),
  transaction: vi.fn(), rate: vi.fn(), queue: vi.fn()
}));
vi.mock("@/lib/prisma", () => ({ prisma: {
  booking: { findUnique: mocks.existing }, service: { findFirst: mocks.service }, doctor: { findFirst: mocks.doctor }, $transaction: mocks.transaction
} }));
vi.mock("@/lib/rate-limit", () => ({ checkBookingRateLimit: mocks.rate }));
vi.mock("@/lib/queue", () => ({ enqueueBookingIntegrations: mocks.queue }));
vi.mock("@/lib/admin", () => ({ requireAdmin: vi.fn(), unauthorized: vi.fn() }));
import { POST } from "@/app/api/bookings/route";

const input = {
  idempotencyKey: "79d0f9a2-5692-47ec-b6de-56a7087346cb", serviceSlug: "terapiya", doctorSlug: "",
  date: "2026-07-15", time: "morning", name: "Alex Taylor", phone: "07700 900123", email: "", comment: "", consent: true
};
const request = (data: unknown) => new NextRequest("http://localhost/api/bookings", { method: "POST", body: JSON.stringify(data) });

describe("booking API", () => {
  beforeEach(() => {
    vi.resetAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date("2026-06-15T08:00:00Z"));
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost:5432/test");
    mocks.existing.mockResolvedValue(null);
    mocks.service.mockResolvedValue({ id: 1, name: "Fillings & Root Canal Treatment" });
    mocks.doctor.mockResolvedValue(null);
    mocks.rate.mockResolvedValue({ allowed: true });
    mocks.create.mockResolvedValue({ id: 42, publicId: "demo-request-42", status: "new" });
    mocks.events.mockResolvedValue({ count: 3 });
    mocks.transaction.mockImplementation((fn) => fn({ booking: { create: mocks.create }, integrationEvent: { createMany: mocks.events } }));
    mocks.queue.mockResolvedValue([]);
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("stores a normalised UK phone, London date and notification events", async () => {
    const response = await POST(request(input));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      phone: "+447700900123", normalizedPhone: "+447700900123", preferDate: new Date("2026-07-15T11:00:00Z"), preferTime: "morning"
    }) });
    expect(mocks.events).toHaveBeenCalled();
    expect((await response.json()).publicId).toBe("demo-request-42");
  });

  it.each([
    ["2026-03-29", "2026-03-29T11:00:00.000Z"],
    ["2026-10-25", "2026-10-25T12:00:00.000Z"],
    ["2026-11-15", "2026-11-15T12:00:00.000Z"]
  ])("stores calendar date %s at London noon across GMT/BST", async (date, expected) => {
    vi.setSystemTime(new Date("2026-01-01T09:00:00Z"));
    const response = await POST(request({ ...input, date }));
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ preferDate: new Date(expected) }) });
  });

  it.each(["15/07/2026", "2026-07-15T00:00:00Z", "2026-06-14"])("rejects a malformed or past calendar date %s", async (date) => {
    const response = await POST(request({ ...input, date }));
    expect(response.status).toBe(400);
    expect((await response.json()).fieldErrors.date).toBeTruthy();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it.each([{ phone: "07012345678" }, { date: "2026-02-30" }, { consent: false }, { email: "invalid" }])("rejects invalid data without writing: %o", async (fields) => {
    const response = await POST(request({ ...input, ...fields }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).not.toMatch(/[А-Яа-я]/);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects a dentist who does not provide the selected treatment", async () => {
    const response = await POST(request({ ...input, doctorSlug: "wrong-dentist" }));
    expect(response.status).toBe(400);
    expect(mocks.doctor).toHaveBeenCalledWith({ where: expect.objectContaining({ isActive: true, deletedAt: null, services: { some: { id: 1 } } }) });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("acknowledges a retry even after the preferred date has passed", async () => {
    mocks.existing.mockResolvedValue({ publicId: "existing-request" });
    const response = await POST(request({ ...input, date: "2020-01-01" }));
    expect(await response.json()).toEqual({ publicId: "existing-request", duplicated: true });
    expect(mocks.rate).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("handles concurrent duplicate requests without a second booking", async () => {
    mocks.existing.mockResolvedValueOnce(null).mockResolvedValueOnce({ publicId: "existing-request" });
    mocks.transaction.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("Duplicate", { code: "P2002", clientVersion: "5.22.0" }));
    expect((await POST(request(input))).status).toBe(200);
    expect(mocks.queue).not.toHaveBeenCalled();
  });

  it("keeps a saved request successful if notification scheduling fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.queue.mockRejectedValue(new Error("Queue unavailable"));
    expect((await POST(request(input))).status).toBe(201);
  });

  it("returns a friendly service error without leaking database details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.transaction.mockRejectedValue(new Error("DATABASE_URL secret detail"));
    const response = await POST(request(input));
    expect(response.status).toBe(500);
    expect((await response.json()).error).not.toMatch(/DATABASE_URL|secret|Prisma/);
  });
});
