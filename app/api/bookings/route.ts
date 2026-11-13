import { IntegrationKind, Prisma } from "@prisma/client";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { enqueueBookingIntegrations } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import { checkBookingRateLimit } from "@/lib/rate-limit";
import { normalizePhone, sanitizeText } from "@/lib/utils";
import { bookingSchema } from "@/lib/validations";
import { bookingDateToUtc, formatBookingTime } from "@/lib/booking-time";
import { legacyDoctorSlugs } from "@/prisma/doctor-aliases";

export async function POST(request: NextRequest) {
  let idempotencyKey: string | undefined;
  try {
    let body: unknown;
    try { body = await request.json(); }
    catch { return NextResponse.json({ error: "We could not read your request. Please refresh the page and try again." }, { status: 400 }); }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: "Online requests are temporarily unavailable. Please try again later."
      }, { status: 503 });
    }

    const key = z.object({ idempotencyKey: z.string().uuid() }).safeParse(body);
    if (key.success) {
      idempotencyKey = key.data.idempotencyKey;
      const existing = await prisma.booking.findUnique({ where: { idempotencyKey }, select: { publicId: true } });
      if (existing) return NextResponse.json({ publicId: existing.publicId, duplicated: true });
    }
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message]));
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check your details and try again.", fieldErrors }, { status: 400 });
    }

    const input = parsed.data;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rate = await checkBookingRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json({ error: "You have sent several requests recently. Please wait an hour before trying again." }, { status: 429 });
    }

    const service = await prisma.service.findFirst({ where: { slug: input.serviceSlug, isActive: true } });
    if (!service) return NextResponse.json({ error: "This treatment is no longer available. Please choose another option.", fieldErrors: { serviceSlug: "Please choose another treatment." } }, { status: 400 });
    const doctor = input.doctorSlug
      ? await prisma.doctor.findFirst({ where: { slug: legacyDoctorSlugs[input.doctorSlug] || input.doctorSlug, isActive: true, deletedAt: null, services: { some: { id: service.id } } } })
      : null;
    if (input.doctorSlug && !doctor) return NextResponse.json({ error: "This dentist is not available for the selected treatment. Please choose another dentist or no preference.", fieldErrors: { doctorSlug: "Please choose another dentist or no preference." } }, { status: 400 });

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          idempotencyKey: input.idempotencyKey,
          name: sanitizeText(input.name),
          phone: normalizePhone(input.phone),
          normalizedPhone: normalizePhone(input.phone),
          email: input.email || null,
          serviceId: service.id,
          doctorId: doctor?.id,
          preferDate: bookingDateToUtc(input.date),
          preferTime: input.time,
          comment: input.comment ? sanitizeText(input.comment) : null,
          consentAt: new Date()
        }
      });
      const kinds = [
        IntegrationKind.telegram,
        IntegrationKind.email_admin,
        IntegrationKind.amocrm,
        ...(input.email ? [IntegrationKind.email_client] : [])
      ];
      await tx.integrationEvent.createMany({
        data: kinds.map((kind) => ({ bookingId: created.id, kind }))
      });
      return created;
    });

    const kinds = [
      IntegrationKind.telegram,
      IntegrationKind.email_admin,
      IntegrationKind.amocrm,
      ...(input.email ? [IntegrationKind.email_client] : [])
    ];
    // A notification failure must not turn a saved request into an apparent failure.
    await enqueueBookingIntegrations(booking.id, kinds).catch((error) => {
      console.error("Could not enqueue booking notifications", error);
    });

    return NextResponse.json({
      id: booking.id,
      publicId: booking.publicId,
      status: booking.status,
      summary: { service: service.name, doctor: doctor?.name || "No preference", date: input.date, time: formatBookingTime(input.time) }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && idempotencyKey) {
      const existing = await prisma.booking.findUnique({ where: { idempotencyKey }, select: { publicId: true } }).catch(() => null);
      if (existing) return NextResponse.json({ publicId: existing.publicId, duplicated: true });
    }
    console.error("Booking creation failed", error);
    return NextResponse.json({
      error: "We could not save your request just now. Please try again shortly."
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const query = params.get("query");
  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(query ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } }
        ]
      } : {})
    },
    include: { service: true, doctor: true, integrations: true },
    orderBy: { createdAt: "desc" },
    take: 500
  });
  return NextResponse.json(bookings);
}
