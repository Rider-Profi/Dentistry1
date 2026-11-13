import type { MetadataRoute } from "next";
import { doctors, services } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPages = ["", "/services", "/doctors", "/prices", "/reviews", "/booking", "/privacy"];
  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const })),
    ...doctors.map((doctor) => ({ url: `${base}/doctors/${doctor.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const }))
  ];
}
