import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, note }: { label: string; value: number; icon: LucideIcon; note: string }) {
  return (
    <article className="rounded-3xl border border-ink/5 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-ink/50">{label}</p>
          <p className="display-title mt-3 text-4xl">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-mint text-teal"><Icon size={20} /></span>
      </div>
      <p className="mt-5 text-xs text-ink/40">{note}</p>
    </article>
  );
}
