import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = { title: "Administration | SmileCare Dental Studio", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
