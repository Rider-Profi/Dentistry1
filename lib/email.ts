import { siteConfig } from "@/lib/site-config";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { AdminNotificationEmail } from "@/emails/admin-notification";
import { ClientConfirmationEmail } from "@/emails/client-confirmation";
import type { BookingPayload } from "@/lib/booking-payload";

type Mail = { to: string | string[]; from: string; subject: string; html: string; text: string; replyTo?: string };

async function deliver(mail: Mail) {
  if (process.env.EMAIL_PROVIDER === "smtp") {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    return transporter.sendMail(mail);
  }

  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(process.env.RESEND_API_KEY).emails.send(mail);
}

export async function sendAdminNotification(booking: BookingPayload) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const adminUrl = `${siteUrl}/admin/bookings/${booking.id}`;
  const html = await render(AdminNotificationEmail({ booking, adminUrl }));
  const text = [
    "New appointment request",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Treatment: ${booking.serviceName}`,
    `Dentist: ${booking.doctorName}`,
    `Preferred visit: ${booking.date}, ${booking.time}`,
    booking.comment ? `Note: ${booking.comment}` : "",
    `View request: ${adminUrl}`
  ].filter(Boolean).join("\n");

  return deliver({
    to: (process.env.EMAIL_ADMIN_TO || "").split(",").map((item) => item.trim()).filter(Boolean),
    from: process.env.EMAIL_FROM || "noreply@example.com",
    replyTo: process.env.EMAIL_REPLY_TO,
    subject: `New appointment request — ${booking.name}, ${booking.date}`,
    html,
    text
  });
}

export async function sendClientConfirmation(booking: BookingPayload) {
  if (!booking.email) return { skipped: true };
  const clinicPhone = siteConfig.phone;
  const html = await render(ClientConfirmationEmail({ booking, clinicPhone }));
  const text = [
    `Hello ${booking.name.split(" ")[0]}!`,
    "We have received your appointment request. Your preferred time is not confirmed yet.",
    `Treatment: ${booking.serviceName}`,
    `Dentist: ${booking.doctorName}`,
    `Preferred visit: ${booking.date}, ${booking.time}`,
    `The team will contact you on ${booking.phone} during opening hours to agree an appointment.`
  ].join("\n");
  return deliver({
    to: booking.email,
    from: `${siteConfig.name} <${process.env.EMAIL_FROM || "noreply@example.com"}>`,
    replyTo: process.env.EMAIL_REPLY_TO,
    subject: "We have received your appointment request",
    html,
    text
  });
}
