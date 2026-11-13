import { formatBookingDate, formatBookingTime } from "@/lib/booking-time";
import { ArrowLeft, CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookingStatus } from "@/components/admin/booking-status";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getServerSession(authOptions))) redirect("/admin/login");
  const { id } = await params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: { service: true, doctor: true, integrations: true }
  });
  if (!booking) notFound();
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/bookings" className="flex items-center gap-2 text-sm font-bold text-teal"><ArrowLeft size={17} /> Back to requests</Link>
      <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><span className="eyebrow">Request #{booking.id}</span><h1 className="display-title mt-3 text-4xl md:text-5xl">{booking.name}</h1></div>
        <div className="w-full md:w-56"><BookingStatus id={booking.id} initial={booking.status} /></div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-3xl bg-white p-7">
          <h2 className="display-title text-2xl">Request details</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Phone", booking.phone],
              ["Email", booking.email || "Not provided"],
              ["Treatment", booking.service?.name || "Consultation"],
              ["Dentist", booking.doctor?.name || "No preference"],
              ["Date", booking.preferDate ? formatBookingDate(booking.preferDate) : "To be arranged"],
              ["Time", formatBookingTime(booking.preferTime)]
            ].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wider text-ink/40">{label}</dt><dd className="mt-2 font-bold">{value}</dd></div>)}
          </dl>
          {booking.comment && <div className="mt-7 rounded-2xl bg-cream p-5"><p className="text-xs font-bold uppercase tracking-wider text-ink/40">Message</p><p className="mt-2 leading-6">{booking.comment}</p></div>}
        </section>
        <section className="rounded-3xl bg-white p-7">
          <h2 className="display-title text-2xl">Notifications</h2>
          <div className="mt-6 grid gap-4">
            {booking.integrations.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                {event.status === "succeeded" ? <CheckCircle2 className="text-teal" size={20} /> : event.status === "failed" ? <CircleAlert className="text-red-600" size={20} /> : <Clock3 className="text-ink/35" size={20} />}
                <div><p className="text-sm font-bold">{event.kind.replace("_", " ")}</p><p className="mt-1 text-xs text-ink/45">{event.status} · attempts: {event.attempts}</p>{event.lastError && <p className="mt-1 text-xs text-red-600">{event.lastError}</p>}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
