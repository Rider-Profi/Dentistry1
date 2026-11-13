import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(await prisma.service.findMany({
    where: { isActive: true },
    include: { prices: { where: { isActive: true } }, doctors: { where: { isActive: true, deletedAt: null } } },
    orderBy: [{ category: "asc" }, { name: "asc" }]
  }));
}
