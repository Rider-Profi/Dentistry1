import { Client } from "@upstash/qstash";
import { IntegrationKind } from "@prisma/client";
import { processIntegration } from "@/lib/integrations";

export async function enqueueBookingIntegrations(bookingId: number, kinds: IntegrationKind[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const token = process.env.QSTASH_TOKEN;
  if (token && siteUrl) {
    const qstash = new Client({ token });
    return Promise.allSettled(kinds.map((kind) =>
      qstash.publishJSON({
        url: `${siteUrl}/api/jobs/integration`,
        body: { bookingId, kind },
        retries: 0,
        headers: { "x-job-key": `${bookingId}:${kind}` }
      })
    ));
  }

  // Local development fallback. Production must configure QStash.
  return Promise.allSettled(kinds.map((kind) => processIntegration(bookingId, kind)));
}
