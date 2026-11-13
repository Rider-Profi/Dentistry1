import { formatLondonDateTime } from "@/lib/booking-time";
import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createPricesWorkbook } from "@/lib/xlsx";

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const bookings = await prisma.booking.findMany({
    include: { service: true, doctor: true },
    orderBy: { createdAt: "desc" }
  });
  const file = await createPricesWorkbook(bookings.map((booking) => ({
    "Request ID": booking.id,
    "Patient": booking.name,
    "Phone": booking.phone,
    "Email": booking.email || "",
    "Treatment": booking.service?.name || "Consultation",
    "Dentist": booking.doctor?.name || "No preference",
    "Status": booking.status,
    "Received (London)": formatLondonDateTime(booking.createdAt)
  })), ["Request ID", "Patient", "Phone", "Email", "Treatment", "Dentist", "Status", "Received (London)"]);
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="bookings.xlsx"'
    }
  });
}
