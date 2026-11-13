import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { doctorSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json(await prisma.doctor.findMany({
    where: { deletedAt: null },
    include: { services: true },
    orderBy: { name: "asc" }
  }));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const parsed = doctorSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { serviceIds, ...data } = parsed.data;
  return NextResponse.json(await prisma.doctor.create({
    data: { ...data, services: { connect: serviceIds.map((id) => ({ id })) } },
    include: { services: true }
  }), { status: 201 });
}
