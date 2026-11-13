import type { Metadata } from "next";
import { DoctorCard } from "@/components/doctor-card";
import { PageHero } from "@/components/page-hero";
import { doctors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meet Our Dental Team",
  description: "Meet the fictional SmileCare team: a portfolio demonstration of thoughtful, patient-centred dental profiles."
};

export default function DoctorsPage() {
  return (
    <>
      <PageHero eyebrow="Meet the team" title="A friendly face. A listening ear.">
        Get to know the people behind our example practice, each with a calm approach and time for your questions.
      </PageHero>
      <section className="py-20 md:py-28">
        <div className="container-shell">
          <p className="mb-8 rounded-2xl border border-teal/15 bg-mint/40 px-5 py-4 text-sm leading-6 text-ink/75">Meet our fictional team. These illustrated profiles are created for a portfolio demonstration and do not represent practising clinicians or verified qualifications.</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}
          </div>
        </div>
      </section>
    </>
  );
}
