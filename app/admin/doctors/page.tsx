import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DoctorsManager } from "@/components/admin/doctors-manager";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  if (!(await getServerSession(authOptions))) redirect("/admin/login");
  const [doctors, services] = await Promise.all([
    prisma.doctor.findMany({ where: { deletedAt: null }, include: { services: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } })
  ]);
  return (
    <div className="mx-auto max-w-6xl">
      <span className="eyebrow">Team management</span>
      <h1 className="display-title mt-3 text-4xl md:text-5xl">Dentist profiles</h1>
      <DoctorsManager initialDoctors={JSON.parse(JSON.stringify(doctors))} services={services} />
    </div>
  );
}
