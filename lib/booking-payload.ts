import { formatBookingDate, formatBookingTime, formatLondonDateTime } from "@/lib/booking-time";
import { prisma } from "@/lib/prisma";

export async function getBookingPayload(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, doctor: true }
  });
  if (!booking) throw new Error(`Booking ${bookingId} not found`);

  return {
    id: booking.id,
    publicId: booking.publicId,
    name: booking.name,
    phone: booking.phone,
    normalizedPhone: booking.normalizedPhone,
    email: booking.email,
    serviceName: booking.service?.name || "Consultation",
    doctorName: booking.doctor?.name || "No preference",
    date: booking.preferDate ? formatBookingDate(booking.preferDate) : "To be arranged",
    dateIso: booking.preferDate?.toISOString(),
    time: formatBookingTime(booking.preferTime),
    comment: booking.comment,
    createdAt: formatLondonDateTime(booking.createdAt),
    source: booking.source
  };
}

export type BookingPayload = Awaited<ReturnType<typeof getBookingPayload>>;
