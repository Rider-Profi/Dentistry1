import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BookingsTable } from "@/components/admin/bookings-table";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  if (!(await getServerSession(authOptions))) redirect("/admin/login");
  const bookings = await prisma.booking.findMany({
    include: { service: true, doctor: true },
    orderBy: { createdAt: "desc" },
    take: 500
  });
  return (
    <div className="mx-auto max-w-7xl">
      <span className="eyebrow">Practice management</span>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <h1 className="display-title mt-3 text-4xl md:text-5xl">Appointment requests</h1>
        <Button href="/api/bookings/export" variant="secondary">Export XLSX</Button>
      </div>
      <BookingsTable bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
}
