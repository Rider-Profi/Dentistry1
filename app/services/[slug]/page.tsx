import { ArrowRight, PoundSterling } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking/booking-form";
import { DoctorCard } from "@/components/doctor-card";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { doctors, services } from "@/lib/content";
import { formatPrice } from "@/lib/utils";

export const revalidate = 3600;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.name, description: service.shortDescription } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const serviceDoctors = doctors.filter((doctor) => doctor.serviceSlugs.some((slug) => slug === service.slug));

  return (
    <>
      <section className="bg-mint/50 py-20 md:py-28">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="eyebrow">{service.category}</span>
            <h1 className="display-title mt-5 text-4xl leading-tight sm:text-5xl md:text-6xl">{service.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/65">{service.description}</p>
            <Button href="#service-booking" className="mt-8">Book an Appointment <ArrowRight size={18} className="ml-2" /></Button>
          </div>
          <div className="grid aspect-square w-full max-w-md place-items-center rounded-full bg-white text-teal shadow-soft lg:justify-self-end">
            <ServiceIcon name={service.icon} size={110} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-shell grid gap-14 lg:grid-cols-2">
          <div>
            <span className="eyebrow">What to expect</span>
            <h2 className="display-title mt-4 text-4xl">Your treatment, step by step</h2>
            <ol className="mt-8 grid gap-4">
              {service.treatmentSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-4 rounded-2xl bg-cream p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-sm font-bold text-white">{index + 1}</span>
                  <span className="font-bold">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <span className="eyebrow">Treatment fees</span>
            <h2 className="display-title mt-4 text-4xl">Clear costs from the start</h2>
            <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10">
              {service.prices.map((price) => (
                <div key={price.name} className="flex flex-col items-start justify-between gap-4 sm:flex-row border-b border-ink/10 bg-white p-6 last:border-0">
                  <div>
                    <p className="font-bold">{price.name}</p>
                    <p className="mt-2 text-sm text-ink/55">{price.description}</p>
                  </div>
                  <p className="shrink-0 font-bold text-teal">From {formatPrice(price.priceFrom)}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-ink/55"><PoundSterling size={18} className="shrink-0" /> Illustrative demo fees. Your dentist would provide a written estimate before treatment.</p>
          </div>
        </div>
      </section>

      {serviceDoctors.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container-shell">
            <span className="eyebrow">Your dental team</span>
            <h2 className="display-title mt-4 text-4xl md:text-5xl">Meet the team</h2>
            <div className="mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
              {serviceDoctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}
            </div>
          </div>
        </section>
      )}

      <section id="service-booking" className="scroll-mt-24 bg-mint py-20 md:py-28">
        <div className="container-shell rounded-4xl bg-[#fbfaf6] p-6 md:p-12">
          <BookingForm initialService={service.slug} />
        </div>
      </section>
    </>
  );
}
