import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { LocationCard } from "@/components/location-card";

const footerLinks = [
  ["Treatments", "/services"], ["Our Team", "/doctors"],
  ["Treatment Fees", "/prices"], ["Patient Stories", "/reviews"],
  ["Request an Appointment", "/booking"], ["Privacy Policy", "/privacy"]
] as const;

export function SiteFooter() {
  return (
    <footer id="site-footer" className="bg-ink pb-8 pt-14 text-white sm:pt-16">
      <div className="container-shell grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_.8fr_1.2fr]">
        <div className="min-w-0">
          <Logo light />
          <p className="mt-6 max-w-xs text-base leading-7 text-white/80">
            A calmer approach to dental care. Clear conversations, thoughtful details and time for you.
          </p>
          <Link href="/booking" className="focus-ring mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-mint px-5 py-3 text-sm font-bold text-ink hover:bg-white">
            Explore the Booking Demo <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <div className="mt-8 text-sm leading-6 text-white/75">
            <p className="text-xs font-bold uppercase tracking-wider text-mint">Example contact details</p>
            <p className="mt-2">{siteConfig.phone}</p>
            <p>{siteConfig.hours} · London time</p>
            <p className="mt-2 text-xs">Fictional number and opening hours.</p>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Explore SmileCare</p>
          <ul className="mt-4 grid gap-1 text-sm">
            {footerLinks.map(([label, href]) => <li key={href}><Link href={href} className="focus-ring inline-flex min-h-11 items-center rounded-md py-2 text-white/85 hover:text-white hover:underline hover:underline-offset-4">{label}</Link></li>)}
          </ul>
        </nav>
        <div className="md:col-span-2 lg:col-span-1"><LocationCard dark /></div>
      </div>
      <div className="container-shell mt-10 rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-mint"><ShieldCheck size={19} aria-hidden="true" /> Portfolio demonstration · not a healthcare service</p>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-white/80">{siteConfig.demoDisclaimer}</p>
        <p className="mt-2 text-sm leading-6 text-white/80">The stories are sample copy, not genuine patient endorsements or guarantees of treatment outcomes. Use fictional details when testing. For personal health concerns, contact a qualified healthcare professional; do not use this website for urgent help.</p>
      </div>
      <div className="container-shell mt-7 flex flex-col gap-3 text-xs leading-5 text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getUTCFullYear()} {siteConfig.name} · Portfolio project</p>
        <Link href="/privacy#portfolio-demo" className="focus-ring inline-flex min-h-11 items-center rounded-md underline underline-offset-4">Demo &amp; Medical Disclaimer</Link>
      </div>
    </footer>
  );
}
