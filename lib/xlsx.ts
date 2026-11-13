import ExcelJS from "exceljs";
import { z } from "zod";

const rowSchema = z.object({
  service: z.string().trim().min(2, "Enter a treatment name."),
  name: z.string().trim().max(160).optional(),
  category: z.string().trim().min(2, "Enter a category."),
  description: z.string().trim().max(500).optional().default(""),
  priceFrom: z.preprocess((value) => value === "" || value == null ? undefined : value, z.coerce.number().nonnegative("The starting fee must be zero or more.")),
  priceTo: z.union([z.literal(""), z.null(), z.undefined(), z.coerce.number().nonnegative()])
    .transform((value) => value === "" || value == null ? null : value),
  unit: z.string().trim().min(1).optional().default("treatment")
}).refine((row) => row.priceTo == null || row.priceTo >= row.priceFrom, {
  path: ["priceTo"],
  message: "The upper fee must be at least the starting fee."
});

const headers: Record<string, keyof z.input<typeof rowSchema>> = {
  "treatment": "service",
  "fee": "name",
  "category": "category",
  "description": "description",
  "from (£)": "priceFrom",
  "to (£)": "priceTo",
  "unit": "unit",
  // Retain compatibility with workbooks exported before the UK adaptation.
  "услуга": "service",
  "категория": "category",
  "описание": "description",
  "цена от": "priceFrom",
  "цена до": "priceTo",
  "единица": "unit"
};

export type PriceImportRow = z.output<typeof rowSchema> & { row: number };
export type PriceImportError = { row: number; field: string; message: string };

export async function parsePriceWorkbook(buffer: ArrayBuffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(Buffer.from(buffer) as unknown as Parameters<typeof workbook.xlsx.load>[0]);
  const sheet = workbook.worksheets[0];
  if (!sheet) return { valid: [], errors: [{ row: 1, field: "file", message: "The workbook has no worksheets." }] };

  const headerMap = new Map<number, keyof z.input<typeof rowSchema>>();
  sheet.getRow(1).eachCell((cell, column) => {
    const field = headers[String(cell.value || "").trim().toLowerCase()];
    if (field) headerMap.set(column, field);
  });
  const fields = new Set(headerMap.values());
  if (!["service", "category", "priceFrom"].every((field) => fields.has(field as keyof z.input<typeof rowSchema>))) {
    return { valid: [], errors: [{ row: 1, field: "headers", message: "Include Treatment, Category and From (£) columns. Export the current fees for a template." }] };
  }

  const valid: PriceImportRow[] = [];
  const errors: PriceImportError[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const normalized: Record<string, unknown> = {};
    headerMap.forEach((field, column) => {
      const value = row.getCell(column).value;
      normalized[field] = typeof value === "object" && value && "text" in value ? value.text : value ?? "";
    });
    const parsed = rowSchema.safeParse(normalized);
    if (parsed.success) valid.push({ ...parsed.data, row: rowNumber });
    else parsed.error.issues.forEach((issue) => errors.push({
      row: rowNumber,
      field: issue.path.join(".") || "row",
      message: issue.message
    }));
  });
  return { valid, errors };
}

export async function createPricesWorkbook(rows: Array<Record<string, string | number | null>>, columns?: string[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");
  const keys = columns || (rows.length ? Object.keys(rows[0]) : ["Treatment", "Fee", "Category", "Description", "From (£)", "To (£)", "Unit"]);
  sheet.columns = keys.map((key) => ({ header: key, key, width: key === "Description" ? 45 : 22 }));
  rows.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
