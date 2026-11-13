import { formatLondonDateTime } from "@/lib/booking-time";
import { CalendarCheck, CircleAlert, Stethoscope, Tags } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { StatCard } from "@/components/admin/stat-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await getServerSession(authOptions))) redirect("/admin/login");
  const [newBookings, totalBookings, doctors, prices, recent] = await Promise.all([
    prisma.booking.count({ where: { status: "new" } }),
    prisma.booking.count(),
    prisma.doctor.count({ where: { isActive: true, deletedAt: null } }),
    prisma.price.count({ where: { isActive: true } }),
    prisma.booking.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { service: true } })
  ]);
  return (
    <div className="mx-auto max-w-7xl">
      <span className="eyebrow">Dashboard</span>
      <h1 className="display-title mt-3 text-4xl md:text-5xl">Practice overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="New requests" value={newBookings} icon={CircleAlert} note="Awaiting review" />
        <StatCard label="Total requests" value={totalBookings} icon={CalendarCheck} note="All time" />
        <StatCard label="Visible profiles" value={doctors} icon={Stethoscope} note="Shown on the website" />
        <StatCard label="Treatment fees" value={prices} icon={Tags} note="Active fee entries" />
      </div>
      <section className="mt-8 rounded-3xl border border-ink/5 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="display-title text-2xl">Recent requests</h2>
          <Link href="/admin/bookings" className="text-sm font-bold text-teal">View all requests</Link>
        </div>
        <div className="mt-5 divide-y divide-ink/5">
          {recent.map((booking) => (
            <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="grid gap-2 py-4 text-sm hover:text-teal sm:grid-cols-[1fr_1fr_auto]">
              <span className="font-bold">{booking.name}</span>
              <span className="text-ink/55">{booking.service?.name || "Consultation"}</span>
              <time className="text-ink/40">{formatLondonDateTime(booking.createdAt)}</time>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
