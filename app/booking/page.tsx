import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata: Metadata = {
  title: "Request an Appointment",
  description: "Tell SmileCare Dental Studio what you need and when you would like to visit. The team will contact you to confirm availability."
};

export default async function BookingPage({
  searchParams
}: {
  searchParams: Promise<{ service?: string; doctor?: string }>;
}) {
  const query = await searchParams;
  return (
    <section className="min-h-[760px] bg-mint py-12 md:py-20">
      <div className="container-shell rounded-4xl bg-[#fbfaf6] p-6 shadow-soft md:p-12">
        <BookingForm initialService={query.service} initialDoctor={query.doctor} />
      </div>
    </section>
  );
}
