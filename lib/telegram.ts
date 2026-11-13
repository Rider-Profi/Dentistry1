import type { BookingPayload } from "@/lib/booking-payload";

export async function sendTelegramNotification(booking: BookingPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram is not configured");

  const text = [
    "🦷 <b>New appointment request</b>",
    "",
    `👤 Name: ${escapeHtml(booking.name)}`,
    `📞 Phone: ${escapeHtml(booking.phone)}`,
    `🔧 Treatment: ${escapeHtml(booking.serviceName)}`,
    `👨‍⚕️ Dentist: ${escapeHtml(booking.doctorName)}`,
    `📅 Preferred visit: ${escapeHtml(booking.date)}, ${escapeHtml(booking.time)}`,
    booking.comment ? `💬 Note: ${escapeHtml(booking.comment)}` : "",
    "",
    `⏰ Received: ${escapeHtml(booking.createdAt)}`
  ].filter(Boolean).join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" })
  });
  if (!response.ok) throw new Error(`Telegram error: ${await response.text()}`);
  return response.json();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] || char);
}
