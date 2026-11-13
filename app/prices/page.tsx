import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PricesTable } from "@/components/prices-table";

export const metadata: Metadata = {
  title: "Treatment Fees",
  description: "Explore our illustrative private dental fees, with clear starting prices and treatment details."
};

export default function PricesPage() {
  return (
    <>
      <PageHero eyebrow="Treatment fees" title="Know what to expect">
        Explore our guide to treatment fees. Your dentist will explain the options and provide a personalised estimate before treatment begins.
      </PageHero>
      <section className="py-20 md:py-28">
        <div className="container-shell">
          <PricesTable />
          <p className="mt-6 rounded-2xl bg-mint/50 p-5 text-sm leading-6 text-ink/65">
            These are illustrative fees for a fictional portfolio practice, not a quotation. All prices are in pounds sterling. Assessment, scans and additional treatment may be charged separately where stated.
          </p>
        </div>
      </section>
    </>
  );
}
