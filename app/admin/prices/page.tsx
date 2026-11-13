import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PricesManager } from "@/components/admin/prices-manager";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  if (!(await getServerSession(authOptions))) redirect("/admin/login");
  const [prices, services] = await Promise.all([
    prisma.price.findMany({ where: { isActive: true }, include: { service: true }, orderBy: [{ service: { category: "asc" } }, { name: "asc" }] }),
    prisma.service.findMany({ where: { isActive: true }, select: { id: true, name: true, category: true }, orderBy: { name: "asc" } })
  ]);
  return (
    <div className="mx-auto max-w-7xl">
      <span className="eyebrow">Fee management</span>
      <h1 className="display-title mt-3 text-4xl md:text-5xl">Treatment fees</h1>
      <PricesManager initialPrices={JSON.parse(JSON.stringify(prices))} services={services} />
    </div>
  );
}
