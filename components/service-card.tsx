import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ServiceIcon } from "@/components/service-icon";
import { formatPrice } from "@/lib/utils";

type ServiceCardProps = {
  service: {
    slug: string;
    name: string;
    category: string;
    icon: string;
    shortDescription: string;
    prices: ReadonlyArray<{ priceFrom: number }>;
  };
};

export function ServiceCard({ service }: ServiceCardProps) {
  const from = Math.min(...service.prices.map((price) => price.priceFrom));
  return (
    <Link
      href={`/services/${service.slug}`}
      className="focus-ring group flex min-h-72 flex-col rounded-4xl border border-ink/10 bg-white p-7 transition hover:-translate-y-1 hover:border-sage hover:shadow-soft"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mint text-teal">
          <ServiceIcon name={service.icon} />
        </span>
        <ArrowUpRight className="text-ink/25 transition group-hover:text-teal" />
      </div>
      <span className="mt-8 text-xs font-bold uppercase tracking-wider text-teal">{service.category}</span>
      <h3 className="display-title mt-2 text-2xl">{service.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-ink/60">{service.shortDescription}</p>
      <p className="mt-5 text-sm font-bold">From {formatPrice(from)}</p>
    </Link>
  );
}
