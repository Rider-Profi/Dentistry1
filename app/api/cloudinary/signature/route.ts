import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/admin";
import { getCloudinaryUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  if (!(await requireAdmin())) return unauthorized();
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Image uploads are not configured. You can keep the illustrated avatar." }, { status: 503 });
  }
  return NextResponse.json(getCloudinaryUploadSignature());
}
