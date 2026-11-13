import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createPricesWorkbook } from "@/lib/xlsx";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const prices = await prisma.price.findMany({
    where: { isActive: true },
    include: { service: true },
    orderBy: [{ service: { category: "asc" } }, { name: "asc" }]
  });
  const file = await createPricesWorkbook(prices.map((price) => ({
    "Treatment": price.service.name,
    "Fee": price.name,
    "Category": price.service.category,
    "Description": price.description || "",
    "From (£)": Number(price.priceFrom),
    "To (£)": price.priceTo == null ? null : Number(price.priceTo),
    "Unit": price.unit
  })));
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="prices.xlsx"'
    }
  });
}
