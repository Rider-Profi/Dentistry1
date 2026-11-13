import { IntegrationKind, IntegrationStatus } from "@prisma/client";
import { getBookingPayload } from "@/lib/booking-payload";
import { getCrmAdapter } from "@/lib/crm";
import { sendAdminNotification, sendClientConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { sendTelegramNotification } from "@/lib/telegram";

export async function processIntegration(bookingId: number, kind: IntegrationKind) {
  const event = await prisma.integrationEvent.findUnique({
    where: { bookingId_kind: { bookingId, kind } }
  });
  if (!event) throw new Error("Integration event not found");
  if (event.status === IntegrationStatus.succeeded) return { duplicated: true };

  await prisma.integrationEvent.update({
    where: { id: event.id },
    data: { status: IntegrationStatus.processing, attempts: { increment: 1 } }
  });

  try {
    const booking = await getBookingPayload(bookingId);
    const result = await withRetry(async () => {
      switch (kind) {
        case IntegrationKind.telegram:
          return sendTelegramNotification(booking);
        case IntegrationKind.email_admin:
          return sendAdminNotification(booking);
        case IntegrationKind.email_client:
          return sendClientConfirmation(booking);
        case IntegrationKind.amocrm:
          return getCrmAdapter().createLead(booking);
        default:
          throw new Error(`Unsupported integration: ${kind}`);
      }
    });
    const externalId = typeof result === "object" && result && "id" in result ? String(result.id) : null;
    await prisma.integrationEvent.update({
      where: { id: event.id },
      data: { status: IntegrationStatus.succeeded, externalId, lastError: null }
    });
    return result;
  } catch (error) {
    await prisma.integrationEvent.update({
      where: { id: event.id },
      data: {
        status: IntegrationStatus.failed,
        lastError: error instanceof Error ? error.message.slice(0, 2000) : "Unknown error"
      }
    });
    throw error;
  }
}
