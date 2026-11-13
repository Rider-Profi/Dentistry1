"use client";

import { useState } from "react";
import { categories, services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ServiceCard } from "@/components/service-card";

export function ServicesFilter() {
  const [category, setCategory] = useState("All treatments");
  const visible = category === "All treatments" ? services : services.filter((service) => service.category === category);

  return (
    <>
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
        {["All treatments", ...categories].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={cn(
              "focus-ring shrink-0 rounded-full px-5 py-3 text-sm font-bold",
              category === item ? "bg-teal text-white" : "border border-ink/10 bg-white"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((service) => <ServiceCard key={service.slug} service={service} />)}
      </div>
    </>
  );
}
