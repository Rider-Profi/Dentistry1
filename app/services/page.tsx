import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ServicesFilter } from "@/components/services-filter";

export const metadata: Metadata = {
  title: "Dental Treatments",
  description: "Explore fillings, dental hygiene, whitening, implants and teeth straightening at SmileCare Dental Studio."
};

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our treatments" title="Care for every stage of your smile">
        Whether you need a routine visit or want to explore a change, we help you understand your options and choose your next step.
      </PageHero>
      <section className="py-20 md:py-28">
        <div className="container-shell"><ServicesFilter /></div>
      </section>
    </>
  );
}
