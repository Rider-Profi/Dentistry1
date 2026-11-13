import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { priceSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json(await prisma.price.findMany({
    where: { isActive: true },
    include: { service: true },
    orderBy: [{ service: { category: "asc" } }, { name: "asc" }]
  }));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const parsed = priceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json(await prisma.price.create({ data: parsed.data }), { status: 201 });
}
