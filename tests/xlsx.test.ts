import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { createPricesWorkbook, parsePriceWorkbook } from "@/lib/xlsx";

describe("price workbooks", () => {
  it("round-trips UK fees without losing the parent treatment or fee name", async () => {
    const file = await createPricesWorkbook([{
      "Treatment": "General Dentistry", "Fee": "White filling", "Category": "Everyday care",
      "Description": "A composite filling", "From (£)": 180, "To (£)": 260, "Unit": "per tooth"
    }]);
    const report = await parsePriceWorkbook(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
    expect(report.errors).toEqual([]);
    expect(report.valid[0]).toMatchObject({ service: "General Dentistry", name: "White filling", priceFrom: 180, priceTo: 260 });
  });

  it("rejects missing headers and blank starting fees", async () => {
    const missing = await createPricesWorkbook([{ "Unknown": "Value" }]);
    expect((await parsePriceWorkbook(missing.buffer.slice(missing.byteOffset, missing.byteOffset + missing.byteLength))).errors[0].field).toBe("headers");
    const blank = await createPricesWorkbook([{ "Treatment": "Hygiene", "Category": "Prevention", "From (£)": "" }]);
    const report = await parsePriceWorkbook(blank.buffer.slice(blank.byteOffset, blank.byteOffset + blank.byteLength));
    expect(report.valid).toHaveLength(0);
    expect(report.errors[0].field).toBe("priceFrom");
  });

  it("exports and imports the six-column template", async () => {
    const file = await createPricesWorkbook([{
      "Услуга": "Лечение кариеса",
      "Категория": "Терапия",
      "Описание": "Световая пломба",
      "Цена от": 6500,
      "Цена до": null,
      "Единица": "зуб"
    }]);
    const report = await parsePriceWorkbook(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength));
    expect(report.valid).toHaveLength(1);
    expect(report.valid[0]).toMatchObject({ service: "Лечение кариеса", priceFrom: 6500 });
    expect(report.errors).toHaveLength(0);
  });

  it("reports invalid rows without hiding valid rows", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Прайс");
    sheet.addRow(["Услуга", "Категория", "Описание", "Цена от", "Цена до", "Единица"]);
    sheet.addRow(["Гигиена", "Профилактика", "", 7500, "", "услуга"]);
    sheet.addRow(["", "Терапия", "", -1, "", "услуга"]);
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
    const report = await parsePriceWorkbook(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    expect(report.valid).toHaveLength(1);
    expect(report.errors.some((error) => error.row === 3)).toBe(true);
  });
});
