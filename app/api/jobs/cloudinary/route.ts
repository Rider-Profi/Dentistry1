import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";
import { retryCloudinaryCleanup } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const text = await request.text();
  if (process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY) {
    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY
    });
    const valid = await receiver.verify({
      signature: request.headers.get("upstash-signature") || "",
      body: text,
      url: request.url
    });
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "QStash verification is not configured" }, { status: 503 });
  }
  const { eventId } = JSON.parse(text) as { eventId: number };
  await retryCloudinaryCleanup(eventId);
  return NextResponse.json({ ok: true });
}
