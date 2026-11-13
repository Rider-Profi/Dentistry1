import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { priceSchema } from "@/lib/validations";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  const parsed = priceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(await prisma.price.update({ where: { id: Number(id) }, data: parsed.data }));
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { id } = await params;
  return NextResponse.json(await prisma.price.update({
    where: { id: Number(id) },
    data: { isActive: false }
  }));
}
