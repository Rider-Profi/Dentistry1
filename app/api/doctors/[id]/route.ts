import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { cleanupOrSchedule } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { doctorSchema } from "@/lib/validations";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  const parsed = doctorSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const current = await prisma.doctor.findUnique({ where: { id: Number(id) } });
  if (!current) return NextResponse.json({ error: "This dentist profile could not be found." }, { status: 404 });
  const { serviceIds, ...data } = parsed.data;
  const updated = await prisma.doctor.update({
    where: { id: current.id },
    data: { ...data, services: { set: serviceIds.map((id) => ({ id })) } },
    include: { services: true }
  });
  if (current.photoPublicId && current.photoPublicId !== updated.photoPublicId) {
    await cleanupOrSchedule(current.photoPublicId);
  }
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  const current = await prisma.doctor.findUnique({ where: { id: Number(id) } });
  if (!current) return NextResponse.json({ error: "This dentist profile could not be found." }, { status: 404 });
  const updated = await prisma.doctor.update({
    where: { id: current.id },
    data: { deletedAt: new Date(), isActive: false }
  });
  if (current.photoPublicId) await cleanupOrSchedule(current.photoPublicId);
  return NextResponse.json(updated);
}
