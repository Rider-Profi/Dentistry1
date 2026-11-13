import { z } from "zod";

export { bookingSchema } from "@/lib/booking-validation";

export const bookingStatusSchema = z.object({
  status: z.enum(["new", "processing", "confirmed", "completed", "cancelled"])
});

export const doctorSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(120),
  position: z.string().min(2).max(160),
  specialties: z.array(z.string().min(2).max(80)).min(1),
  experience: z.coerce.number().int().min(0).max(70),
  photoUrl: z.union([
    z.string().url(),
    z.enum(["/avatars/emily-smith.svg", "/avatars/james-wilson.svg", "/avatars/olivia-brown.svg"])
  ]),
  photoPublicId: z.string().max(255).nullable().optional(),
  description: z.string().min(20).max(3000),
  education: z.array(z.string().min(2).max(300)),
  certificates: z.array(z.string().min(2).max(300)),
  serviceIds: z.array(z.coerce.number().int().positive()),
  isActive: z.boolean().default(true)
});

export const priceSchema = z.object({
  serviceId: z.coerce.number().int().positive(),
  name: z.string().min(2).max(160),
  description: z.string().max(500).nullable().optional(),
  priceFrom: z.coerce.number().nonnegative(),
  priceTo: z.coerce.number().nonnegative().nullable().optional(),
  unit: z.string().min(1).max(40).default("treatment"),
  isActive: z.boolean().default(true)
}).refine((value) => value.priceTo == null || value.priceTo >= value.priceFrom, {
  message: "The upper fee must be at least the starting fee.",
  path: ["priceTo"]
});
