import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { bookingStatusSchema } from "@/lib/validations";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: { service: true, doctor: true, integrations: true }
  });
  return booking ? NextResponse.json(booking) : NextResponse.json({ error: "This request could not be found." }, { status: 404 });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  const parsed = bookingStatusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please choose a valid request status." }, { status: 400 });
  return NextResponse.json(await prisma.booking.update({
    where: { id: Number(id) },
    data: { status: parsed.data.status }
  }));
}
