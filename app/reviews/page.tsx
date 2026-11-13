import { Star } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LocationCard } from "@/components/location-card";
import { siteConfig } from "@/lib/site-config";
import { reviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Patient Stories — Portfolio Examples",
  description: "Illustrative patient stories written for the fictional SmileCare Dental Studio portfolio project."
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero eyebrow="Patient stories" title="The little things make a difference.">
        A warm welcome, clear explanations and a little reassurance. These fictional stories show the experience our example practice is designed around.
      </PageHero>
      <section className="py-20 md:py-28">
        <div className="container-shell">
          <p className="mb-8 rounded-2xl bg-mint/50 p-5 text-sm leading-6 text-ink/75">Sample stories, not genuine patient reviews. Names, dates, ratings and experiences are fictional and do not predict or guarantee treatment outcomes.</p>
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <blockquote key={review.id} className="rounded-4xl border border-ink/10 bg-white p-8">
                <div className="flex gap-1 text-coral" role="img" aria-label={`${review.rating} out of 5 stars, illustrative rating`}>{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={17} fill="currentColor" aria-hidden="true" />)}</div>
                <p className="mt-6 text-lg leading-8 text-ink/75">&lsquo;{review.text}&rsquo;</p>
                <footer className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-t border-ink/10 pt-5">
                  <div>
                    <p className="font-bold">{review.author}</p>
                    <p className="mt-1 text-xs text-teal">{review.service}{review.doctor ? ` · ${review.doctor}` : ""}</p>
                  </div>
                  <time dateTime={review.date.toISOString().slice(0, 10)} className="shrink-0 text-xs text-ink/65">{review.date.toLocaleDateString(siteConfig.locale, { month: "long", year: "numeric", timeZone: siteConfig.timeZone })}</time>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-12 grid gap-8 rounded-4xl bg-mint/50 p-6 md:grid-cols-2 md:items-center md:p-10">
            <div>
              <span className="eyebrow">Our example setting</span>
              <h2 className="display-title mt-4 text-3xl leading-tight md:text-4xl">A little corner of London</h2>
              <p className="mt-5 max-w-md leading-7 text-ink/75">Our fictional studio is imagined on Baker Street. Explore the area on Google Maps, or browse the rest of the demo at your own pace.</p>
              <p className="mt-4 text-sm leading-6 text-ink/70">The map link shows a real location, not a SmileCare practice. No visits or appointments take place here.</p>
            </div>
            <LocationCard />
          </div>
        </div>
      </section>
    </>
  );
}
