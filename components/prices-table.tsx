"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, services } from "@/lib/content";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PricesTable() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All treatments");
  const rows = useMemo(
    () => services.flatMap((service) => service.prices.map((price) => ({ ...price, service })))
      .filter(({ service, name }) =>
        (category === "All treatments" || service.category === category) &&
        `${service.name} ${name}`.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );

  return (
    <div>
      <div className="mb-7 grid min-w-0 gap-4">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={19} />
          <span className="sr-only">Search treatments</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search treatments"
            className="focus-ring h-14 w-full rounded-full border border-ink/10 bg-white pl-12 pr-5"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {["All treatments", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "focus-ring min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-bold",
                category === item ? "bg-teal text-white" : "border border-ink/10 bg-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <p role="status" className="mb-5 text-sm text-ink/70">{rows.length ? `${rows.length} treatment ${rows.length === 1 ? "option" : "options"}` : "No treatments match your search. Try another name or category."}</p>
      <div className="grid gap-4 md:hidden">
        {rows.map(({ service, ...price }) => (
          <article key={`${service.slug}-${price.name}`} className="min-w-0 rounded-3xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-bold text-teal">{service.category}</p>
            <h2 className="display-title mt-2 text-2xl">{price.name}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{price.description}</p>
            <p className="mt-4 font-bold">From {formatPrice(price.priceFrom)}{"priceTo" in price && price.priceTo ? ` to ${formatPrice(price.priceTo)}` : ""}</p>
            <p className="mt-1 text-xs text-ink/70">{price.unit}</p>
            <Button href={`/booking?service=${service.slug}`} variant="secondary" className="mt-5 w-full">Book an Appointment</Button>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-3xl md:block border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left">
          <caption className="sr-only">Illustrative treatment fees in pounds sterling</caption>
          <thead className="bg-mint/45 text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th scope="col" className="px-6 py-5">Treatment</th>
              <th scope="col" className="px-6 py-5">What is included</th>
              <th scope="col" className="px-6 py-5">Guide fee</th>
              <th scope="col" className="px-6 py-5"><span className="sr-only">Request an appointment</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ service, ...price }) => (
              <tr key={`${service.slug}-${price.name}`} className="border-t border-ink/5">
                <td className="px-6 py-5">
                  <p className="font-bold">{price.name}</p>
                  <p className="mt-1 text-xs text-teal">{service.category}</p>
                </td>
                <td className="max-w-sm px-6 py-5 text-sm text-ink/55">{price.description}</td>
                <td className="whitespace-nowrap px-6 py-5 font-bold">
                  From {formatPrice(price.priceFrom)}
                  {"priceTo" in price && price.priceTo ? ` to ${formatPrice(price.priceTo)}` : ""}
                  <p className="mt-1 text-xs font-normal text-ink/70">{price.unit}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <Button href={`/booking?service=${service.slug}`} variant="secondary" className="min-h-10 px-4">Book an Appointment</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
