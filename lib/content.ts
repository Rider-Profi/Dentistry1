import { doctorsSeed, reviewsSeed, servicesSeed } from "@/prisma/seed-data";
import { siteConfig } from "@/lib/site-config";

export const clinic = {
  name: siteConfig.name,
  phone: siteConfig.phone,
  phoneHref: siteConfig.phoneHref,
  address: siteConfig.address,
  hours: siteConfig.hours,
  email: "hello@smilecare.example"
};

export const services = servicesSeed.map((service) => ({
  ...service,
  prices: service.prices.map((price) => ({ ...price }))
}));

export const doctors = doctorsSeed.map((doctor) => ({ ...doctor }));
export const reviews = reviewsSeed.map((review, index) => ({
  ...review,
  doctor: "doctor" in review ? review.doctor : undefined,
  id: index + 1,
  date: new Date(Date.UTC(2026, 4 - index, 18 - index * 3, 12))
}));

export const categories = Array.from(new Set(services.map((service) => service.category)));
