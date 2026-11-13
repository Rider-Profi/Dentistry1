import { v2 as cloudinary } from "cloudinary";
import { IntegrationKind, IntegrationStatus } from "@prisma/client";
import { Client } from "@upstash/qstash";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export function getCloudinaryUploadSignature() {
  configure();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "smilecare/doctors";
  return {
    timestamp,
    folder,
    signature: cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET || ""),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  };
}

export async function destroyCloudinaryAsset(publicId: string) {
  configure();
  return withRetry(async () => {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    if (!["ok", "not found"].includes(result.result)) throw new Error(`Cloudinary destroy: ${result.result}`);
    return result;
  });
}

export async function cleanupOrSchedule(publicId: string) {
  try {
    await destroyCloudinaryAsset(publicId);
  } catch (error) {
    const event = await prisma.integrationEvent.create({
      data: {
        kind: IntegrationKind.cloudinary_cleanup,
        status: IntegrationStatus.failed,
        attempts: 1,
        payload: { publicId },
        lastError: error instanceof Error ? error.message : "Cloudinary cleanup failed"
      }
    });
    if (process.env.QSTASH_TOKEN && process.env.NEXT_PUBLIC_SITE_URL) {
      await new Client({ token: process.env.QSTASH_TOKEN }).publishJSON({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/cloudinary`,
        body: { eventId: event.id },
        retries: 3
      });
    }
  }
}

export async function retryCloudinaryCleanup(eventId: number) {
  const event = await prisma.integrationEvent.findUnique({ where: { id: eventId } });
  const payload = event?.payload as { publicId?: string } | null;
  if (!event || !payload?.publicId) throw new Error("Cleanup event is invalid");
  try {
    await destroyCloudinaryAsset(payload.publicId);
    await prisma.integrationEvent.update({
      where: { id: event.id },
      data: { status: IntegrationStatus.succeeded, attempts: { increment: 1 }, lastError: null }
    });
  } catch (error) {
    await prisma.integrationEvent.update({
      where: { id: event.id },
      data: {
        status: IntegrationStatus.failed,
        attempts: { increment: 1 },
        lastError: error instanceof Error ? error.message : "Cloudinary cleanup failed"
      }
    });
    throw error;
  }
}
