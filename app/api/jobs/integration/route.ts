import { IntegrationKind } from "@prisma/client";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";
import { processIntegration } from "@/lib/integrations";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  if (process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY) {
    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY
    });
    const valid = await receiver.verify({
      signature: request.headers.get("upstash-signature") || "",
      body: bodyText,
      url: request.url
    });
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "QStash verification is not configured" }, { status: 503 });
  }

  const body = JSON.parse(bodyText) as { bookingId: number; kind: IntegrationKind };
  if (!Object.values(IntegrationKind).includes(body.kind) || !Number.isInteger(body.bookingId)) {
    return NextResponse.json({ error: "Invalid job" }, { status: 400 });
  }
  await processIntegration(body.bookingId, body.kind);
  return NextResponse.json({ ok: true });
}
