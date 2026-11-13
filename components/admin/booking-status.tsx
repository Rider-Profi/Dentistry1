"use client";

import { useState } from "react";

const labels: Record<string, string> = {
  new: "New", processing: "In progress", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled"
};

export function BookingStatus({ id, initial }: { id: number; initial: string }) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function update(next: string) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      if (!response.ok) throw new Error("Could not save the status.");
      setStatus(next);
    } catch {
      setError("Could not save the status. Please try again.");
    } finally { setSaving(false); }
  }
  return <div>
    <label className="text-sm font-bold">Status
      <select value={status} onChange={(e) => update(e.target.value)} disabled={saving} className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 font-normal">
        {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
