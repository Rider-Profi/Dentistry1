import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["superadmin", "manager"].includes(session.user.role)) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
}
