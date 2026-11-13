import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="focus-ring inline-flex shrink-0 flex-col items-start rounded-lg py-1"
      aria-label={`${siteConfig.name} home`}
    >
      <span className={`display-title text-[1.75rem] leading-none sm:text-3xl ${light ? "text-white" : "text-ink"}`}>
        {siteConfig.shortName}
      </span>
      <span className={`mt-1.5 text-[0.625rem] font-semibold uppercase leading-4 tracking-[0.2em] ${light ? "text-white/70" : "text-teal"}`}>
        {siteConfig.descriptor}
      </span>
    </Link>
  );
}
