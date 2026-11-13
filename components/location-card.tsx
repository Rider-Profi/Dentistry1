import { ArrowUpRight, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function LocationCard({ dark = false }: { dark?: boolean }) {
  return (
    <section aria-label="Demonstration location" className={cn("overflow-hidden rounded-3xl border", dark ? "border-white/20 bg-white/5" : "border-ink/10 bg-white")}>
      <div className="relative h-32 overflow-hidden bg-mint" aria-hidden="true">
        <svg viewBox="0 0 480 150" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          <path d="M0 15h480v120H0z" fill="#dcece7" />
          <path d="M-20 20 500 100M-20 110 500 30M100-20l40 200M350-20l-25 200" stroke="#fbfaf6" strokeWidth="18" />
          <path d="M-20 20 500 100M-20 110 500 30" stroke="#78a99b" strokeOpacity=".35" strokeWidth="2" />
          <rect x="176" y="7" width="92" height="31" rx="10" fill="#78a99b" fillOpacity=".3" />
          <rect x="355" y="95" width="75" height="44" rx="14" fill="#78a99b" fillOpacity=".3" />
        </svg>
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-teal text-white shadow-soft"><MapPin size={23} /></span>
        <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-ink/70">Illustration · not to scale</span>
      </div>
      <div className="p-5 sm:p-6">
        <p className={cn("text-[11px] font-bold uppercase tracking-[0.14em]", dark ? "text-mint" : "text-teal")}>A London setting</p>
        <h3 className="display-title mt-3 text-2xl">123 Baker Street</h3>
        <p className={cn("mt-1 text-sm", dark ? "text-white/80" : "text-ink/75")}>London, W1U 6RT</p>
        <p className={cn("mt-3 max-w-sm text-xs leading-5", dark ? "text-white/75" : "text-ink/70")}>Illustrative address only. There is no SmileCare practice here; please do not travel to this address.</p>
        <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer"
          className={cn("focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold underline decoration-current/40 underline-offset-4", dark ? "text-white hover:text-mint" : "text-teal hover:text-ink")}>
          Explore on Google Maps <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
