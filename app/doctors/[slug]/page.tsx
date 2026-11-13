import { Award, BookOpen, Check } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { doctors, services } from "@/lib/content";

export const revalidate = 3600;

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug);
  return doctor ? { title: doctor.name, description: doctor.description } : {};
}

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug);
  if (!doctor) notFound();
  const doctorServices = services.filter((service) => doctor.serviceSlugs.some((slug) => slug === service.slug));

  return (
    <>
      <section className="bg-mint/45 py-16 md:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="relative aspect-[4/4.7] overflow-hidden rounded-4xl bg-white">
            <Image src={doctor.photoUrl} alt={`Illustrated avatar of ${doctor.name}, a fictional dentist`} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
          </div>
          <div>
            <span className="eyebrow">Fictional team profile</span>
            <h1 className="display-title mt-5 text-4xl leading-tight sm:text-5xl md:text-6xl">{doctor.name}</h1>
            <p className="mt-5 text-lg font-bold text-teal">{doctor.position}</p>
            <p className="mt-4 text-sm leading-6 text-ink/70">{doctor.experience} years of illustrative experience. This is a fictional profile, not a claim of professional registration or qualifications.</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/65">{doctor.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {doctor.specialties.map((specialty) => <span key={specialty} className="rounded-full bg-white px-4 py-2 text-sm font-bold">{specialty}</span>)}
            </div>
            <Button href="#doctor-booking" className="mt-8">Explore an Appointment Request</Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-shell grid gap-8 md:grid-cols-2">
          <article className="rounded-4xl bg-cream p-8">
            <BookOpen className="text-teal" />
            <h2 className="display-title mt-6 text-3xl">Illustrative background</h2>
            <ul className="mt-6 grid gap-4">
              {doctor.education.map((item) => <li key={item} className="flex gap-3"><Check size={18} className="mt-0.5 shrink-0 text-teal" />{item}</li>)}
            </ul>
          </article>
          <article className="rounded-4xl bg-mint/50 p-8">
            <Award className="text-teal" />
            <h2 className="display-title mt-6 text-3xl">Example development interests</h2>
            <ul className="mt-6 grid gap-4">
              {doctor.certificates.map((item) => <li key={item} className="flex gap-3"><Check size={18} className="mt-0.5 shrink-0 text-teal" />{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-shell">
          <span className="eyebrow">Areas of care</span>
          <h2 className="display-title mt-4 text-4xl md:text-5xl">How this dentist could help</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {doctorServices.map((service) => <ServiceCard key={service.slug} service={service} />)}
          </div>
        </div>
      </section>

      <section id="doctor-booking" className="scroll-mt-24 bg-mint py-20 md:py-28">
        <div className="container-shell rounded-4xl bg-white p-6 md:p-12">
          <BookingForm initialDoctor={doctor.slug} />
        </div>
      </section>
    </>
  );
}
