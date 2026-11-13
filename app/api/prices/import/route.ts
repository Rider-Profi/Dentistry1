import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { parsePriceWorkbook } from "@/lib/xlsx";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const data = await request.formData();
  const file = data.get("file");
  const confirm = data.get("confirm") === "true";
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an XLSX workbook." }, { status: 400 });
  if (!file.name.toLowerCase().endsWith(".xlsx")) return NextResponse.json({ error: "Please upload an .xlsx file." }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Choose a workbook smaller than 2 MB." }, { status: 400 });
  let report: Awaited<ReturnType<typeof parsePriceWorkbook>>;
  try { report = await parsePriceWorkbook(await file.arrayBuffer()); }
  catch { return NextResponse.json({ error: "This workbook could not be read. Export a fresh template and try again." }, { status: 400 }); }
  if (!confirm) return NextResponse.json({ ...report, imported: 0 });
  if (report.valid.length === 0) return NextResponse.json({ ...report, imported: 0, error: "There are no valid rows to import." }, { status: 422 });

  await prisma.$transaction(async (tx) => {
    for (const row of report.valid) {
      const existing = await tx.service.findFirst({ where: { name: { equals: row.service, mode: "insensitive" } } });
      const slug = existing?.slug || slugify(row.service, { lower: true, strict: true, locale: "en" }) || `service-${row.row}`;
      const feeName = row.name || row.service;
      const service = await tx.service.upsert({
        where: { slug },
        update: { category: row.category },
        create: {
          slug,
          name: row.service,
          category: row.category,
          shortDescription: row.description || row.service,
          description: row.description || row.service,
          icon: "Sparkles",
          treatmentSteps: []
        }
      });
      await tx.price.upsert({
        where: { serviceId_name: { serviceId: service.id, name: feeName } },
        update: {
          description: row.description,
          priceFrom: row.priceFrom,
          priceTo: row.priceTo,
          unit: row.unit,
          isActive: true
        },
        create: {
          serviceId: service.id,
          name: feeName,
          description: row.description,
          priceFrom: row.priceFrom,
          priceTo: row.priceTo,
          unit: row.unit
        }
      });
    }
  });
  return NextResponse.json({ ...report, imported: report.valid.length });
}
