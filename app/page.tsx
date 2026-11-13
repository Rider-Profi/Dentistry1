import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  HeartHandshake,
  ShieldCheck,
  Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/booking/booking-form";
import { DoctorCard } from "@/components/doctor-card";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { doctors, reviews, services } from "@/lib/content";

const features = [
  {
    icon: HeartHandshake,
    title: "Care at your pace",
    description: "Feeling nervous? We listen, explain each step and give you time to feel comfortable."
  },
  {
    icon: ShieldCheck,
    title: "Clarity from the start",
    description: "Understand your options and the costs before deciding what feels right for you."
  },
  {
    icon: BadgeCheck,
    title: "A team that listens",
    description: "Share your concerns and goals. We shape your care around what matters to you."
  }
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-cream">
        <Image src="/clinic-hero.png" alt="A bright, welcoming dental treatment room" fill priority className="object-cover object-[65%_center] lg:object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-cream/95 sm:bg-transparent sm:bg-gradient-to-r sm:from-cream sm:via-cream/95 sm:to-cream/10" />
        <div className="container-shell relative flex items-center py-14 sm:py-20 lg:min-h-[680px] lg:py-24">
          <div className="min-w-0 max-w-2xl">
            <span className="eyebrow">Dental care built around you</span>
            <h1 id="hero-title" className="display-title hero-title mt-5">
              Feel at ease. Smile with confidence.
            </h1>
            <p className="hero-copy mt-6 text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
              A team that listens. Advice that makes sense. Personalised dental care to help you feel comfortable at every visit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#booking">Book an Appointment <ArrowRight size={18} className="ml-2 shrink-0" aria-hidden="true" /></Button>
              <Button href="/services" variant="secondary">Explore Treatments</Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-ink/65">
              <span className="flex items-center gap-2"><BadgeCheck size={18} className="shrink-0 text-teal" aria-hidden="true" /> Clear treatment plans</span>
              <span className="flex items-center gap-2"><Clock3 size={18} className="shrink-0 text-teal" aria-hidden="true" /> Time to talk things through</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading eyebrow="Our approach" title="Your comfort comes first." align="center">
            Good dental care starts with a conversation. We take the time to understand you, so you can feel confident about your next step.
          </SectionHeading>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-4xl bg-mint/45 p-8">
                <Icon size={28} className="text-teal" aria-hidden="true" />
                <h3 className="display-title mt-8 text-2xl leading-snug">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/75">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Our treatments" title="Care for every stage of your smile" />
            <Link href="/services" className="focus-ring flex items-center gap-2 self-start rounded-lg font-bold text-teal">
              Explore all treatments <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading eyebrow="Our team" title="Get to know your dental team" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {doctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}
          </div>
        </div>
      </section>

      <section id="booking" className="scroll-mt-24 bg-mint py-20 md:py-28">
        <div className="container-shell rounded-4xl bg-[#fbfaf6] p-6 shadow-soft md:p-12">
          <BookingForm compact />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-shell">
          <SectionHeading eyebrow="Patient stories" title="A little reassurance from others" align="center">
            Illustrative stories written for this portfolio demo. These are not genuine patient reviews or promises of treatment outcomes.
          </SectionHeading>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <blockquote key={review.id} className="rounded-4xl border border-ink/10 bg-white p-7">
                <div className="flex gap-1 text-coral" role="img" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}
                </div>
                <p className="mt-6 leading-7 text-ink/75">&lsquo;{review.text}&rsquo;</p>
                <footer className="mt-7 border-t border-ink/10 pt-5">
                  <p className="font-bold">{review.author}</p>
                  <p className="mt-1 text-xs text-teal">{review.service}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
