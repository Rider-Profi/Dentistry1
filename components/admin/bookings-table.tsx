"use client";

import { formatBookingDate, formatLondonDateTime } from "@/lib/booking-time";


import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Booking = {
  id: number;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
  preferDate?: string | null;
  service?: { name: string } | null;
  doctor?: { name: string } | null;
};

const labels: Record<string, string> = {
  new: "New",
  processing: "In progress",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled"
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = useMemo(() => bookings.filter((booking) =>
    (status === "all" || booking.status === status) &&
    `${booking.name} ${booking.phone} ${booking.service?.name}`.toLowerCase().includes(query.toLowerCase())
  ), [bookings, query, status]);

  return (
    <>
      <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
          <input aria-label="Search appointment requests" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, phone or treatment" className="h-13 w-full rounded-2xl border border-ink/10 bg-white py-3 pl-11 pr-4" />
        </label>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-12 rounded-2xl border border-ink/10 bg-white px-4">
          <option value="all">All statuses</option>
          {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div role="region" aria-label="Appointment requests table; scroll horizontally on small screens" tabIndex={0} className="focus-ring mt-5 max-w-full overflow-x-auto rounded-3xl border border-ink/5 bg-white">
        <table className="w-full min-w-[850px] table-fixed text-left text-sm">
          <thead className="bg-mint/35 text-xs uppercase tracking-wider text-ink/45">
            <tr><th className="p-5">Patient</th><th className="p-5">Treatment</th><th className="p-5">Preferred date</th><th className="p-5">Status</th><th className="p-5">Received</th></tr>
          </thead>
          <tbody>
            {!rows.length && <tr><td colSpan={5} className="p-5 text-ink/60">No appointment requests match your search.</td></tr>}
            {rows.map((booking) => (
              <tr key={booking.id} className="border-t border-ink/5 hover:bg-cream/40">
                <td className="p-5"><Link href={`/admin/bookings/${booking.id}`} className="font-bold hover:text-teal">{booking.name}</Link><p className="mt-1 text-xs text-ink/45">{booking.phone}</p></td>
                <td className="p-5">{booking.service?.name || "Consultation"}<p className="mt-1 text-xs text-ink/45">{booking.doctor?.name || "No preference"}</p></td>
                <td className="p-5">{booking.preferDate ? formatBookingDate(booking.preferDate) : "To be arranged"}</td>
                <td className="p-5"><span className={cn("rounded-full px-3 py-1 text-xs font-bold", booking.status === "new" ? "bg-coral/20 text-red-800" : "bg-mint text-teal")}>{labels[booking.status]}</span></td>
                <td className="p-5 text-ink/45">{formatLondonDateTime(booking.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
