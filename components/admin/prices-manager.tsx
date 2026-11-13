"use client";

import { Download, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Service = { id: number; name: string; category: string };
type Price = {
  id: number;
  serviceId: number;
  name: string;
  description: string | null;
  priceFrom: string;
  priceTo: string | null;
  unit: string;
  isActive: boolean;
  service: Service;
};
type Report = { valid: Array<{ row: number; service: string; priceFrom: number }>; errors: Array<{ row: number; field: string; message: string }>; imported: number };

export function PricesManager({ initialPrices, services }: { initialPrices: Price[]; services: Service[] }) {
  const [prices, setPrices] = useState(initialPrices);
  const [report, setReport] = useState<Report | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPrice, setNewPrice] = useState({ serviceId: services[0]?.id || 0, name: "", description: "", priceFrom: 0, priceTo: "", unit: "treatment", isActive: true });

  async function saveRow(price: Price) {
    try {
      const response = await fetch(`/api/prices/${price.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...price, priceFrom: Number(price.priceFrom), priceTo: price.priceTo ? Number(price.priceTo) : null }) });
      if (!response.ok) { setError("Could not save this fee. Check the amounts and try again."); return; }
      const saved = await response.json();
      setError("");
      setPrices((current) => current.map((item) => item.id === price.id ? { ...item, ...saved } : item));
    } catch { setError("Could not save this fee. Please check your connection and try again."); }
  }

  async function add() {
    setError("");
    try {
      const response = await fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newPrice, priceTo: newPrice.priceTo ? Number(newPrice.priceTo) : null }) });
      if (response.ok) {
        const created = await response.json();
        created.service = services.find((service) => service.id === created.serviceId);
        setPrices((current) => [...current, created]);
        setNewPrice({ ...newPrice, name: "", description: "", priceFrom: 0, priceTo: "" });
      } else { setError("Enter a fee description and a valid starting amount, then try again."); }
    } catch { setError("Could not add this fee. Please check your connection and try again."); }
  }

  async function remove(id: number) {
    if (!window.confirm("Remove this treatment fee?")) return;
    try {
      if (!(await fetch(`/api/prices/${id}`, { method: "DELETE" })).ok) throw new Error("Could not remove this fee.");
      setPrices((current) => current.filter((price) => price.id !== id));
    } catch { setError("Could not remove this fee. Please try again."); }
  }

  async function upload(confirm = false) {
    if (!file) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("confirm", String(confirm));
      const response = await fetch("/api/prices/import", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.valid) || !Array.isArray(result.errors)) {
        setError(typeof result.error === "string" ? result.error : "Could not read this workbook. Please check the file and try again.");
        setReport(null);
        return;
      }
      setError("");
      setReport(result);
      if (confirm && result.imported > 0) window.location.reload();
    } catch { setError("Could not upload the workbook. Please check your connection and try again."); }
    finally { setLoading(false); }
  }

  return (
    <>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="mt-8 grid gap-4 rounded-3xl bg-white p-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <label className="text-sm font-bold">Price workbook (.xlsx)
          <input type="file" accept=".xlsx" onChange={(e) => { setFile(e.target.files?.[0] || null); setReport(null); }} className="mt-2 block w-full rounded-2xl border border-ink/10 p-3 font-normal" />
        </label>
        <Button variant="secondary" onClick={() => upload(false)} disabled={!file || loading}><Upload size={17} className="mr-2" /> Check workbook</Button>
        <Button href="/api/prices/export" variant="secondary"><Download size={17} className="mr-2" /> Export XLSX</Button>
      </div>
      {report && <div className="mt-4 rounded-3xl bg-white p-5">
        <p className="font-bold">Valid rows: {report.valid.length} · Errors: {report.errors.length}</p>
        {report.errors.length > 0 && <div className="mt-3 max-h-40 overflow-y-auto text-sm text-red-700">{report.errors.map((error, index) => <p key={index}>Row {error.row}, {error.field}: {error.message}</p>)}</div>}
        {report.valid.length > 0 && report.imported === 0 && <Button onClick={() => upload(true)} className="mt-4" disabled={loading}>{loading && <Loader2 size={17} className="mr-2 animate-spin" />} Import valid rows</Button>}
      </div>}

      <section className="mt-6 rounded-3xl bg-white p-5">
        <h2 className="display-title text-2xl">Add a treatment fee</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <select aria-label="Treatment for the new fee" value={newPrice.serviceId} onChange={(e) => setNewPrice({ ...newPrice, serviceId: Number(e.target.value) })} className="min-h-12 rounded-xl border border-ink/10 px-3 xl:col-span-2">{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select>
          <input aria-label="New fee description" placeholder="Fee description" value={newPrice.name} onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })} className="min-h-12 rounded-xl border border-ink/10 p-3 xl:col-span-2" />
          <input aria-label="Starting fee in pounds" min="0" step="0.01" type="number" placeholder="From (£)" value={newPrice.priceFrom} onChange={(e) => setNewPrice({ ...newPrice, priceFrom: Number(e.target.value) })} className="min-h-12 rounded-xl border border-ink/10 p-3" />
          <Button onClick={add}><Plus size={17} className="mr-1" /> Add fee</Button>
        </div>
      </section>

      <div role="region" aria-label="Treatment fees table; scroll horizontally on small screens" tabIndex={0} className="focus-ring mt-6 max-w-full overflow-x-auto rounded-3xl border border-ink/5 bg-white">
        <table className="w-full min-w-[950px] table-fixed text-left text-sm">
          <thead className="bg-mint/35 text-xs uppercase tracking-wider text-ink/45"><tr><th className="p-4">Treatment</th><th className="p-4">Fee description</th><th className="p-4">Description</th><th className="p-4">From (£)</th><th className="p-4">To (£)</th><th className="p-4">Unit</th><th className="p-4" /></tr></thead>
          <tbody>{prices.map((price) => <PriceRow key={price.id} price={price} onChange={(next) => setPrices((current) => current.map((item) => item.id === next.id ? next : item))} onSave={saveRow} onRemove={remove} />)}</tbody>
        </table>
      </div>
    </>
  );
}

function PriceRow({ price, onChange, onSave, onRemove }: { price: Price; onChange: (price: Price) => void; onSave: (price: Price) => void; onRemove: (id: number) => void }) {
  return <tr className="border-t border-ink/5">
    <td className="p-3 font-bold">{price.service.name}</td>
    <td className="p-3"><input aria-label={`Fee description for ${price.service.name}`} value={price.name} onChange={(e) => onChange({ ...price, name: e.target.value })} onBlur={() => onSave(price)} className="w-full rounded-lg border border-transparent p-2 hover:border-ink/10" /></td>
    <td className="p-3"><input aria-label={`Notes for ${price.name}`} value={price.description || ""} onChange={(e) => onChange({ ...price, description: e.target.value })} onBlur={() => onSave(price)} className="w-full rounded-lg border border-transparent p-2 hover:border-ink/10" /></td>
    <td className="p-3"><input aria-label={`Starting fee for ${price.name}`} min="0" step="0.01" type="number" value={price.priceFrom} onChange={(e) => onChange({ ...price, priceFrom: e.target.value })} onBlur={() => onSave(price)} className="w-28 rounded-lg border border-transparent p-2 hover:border-ink/10" /></td>
    <td className="p-3"><input aria-label={`Upper fee for ${price.name}`} min="0" step="0.01" type="number" value={price.priceTo || ""} onChange={(e) => onChange({ ...price, priceTo: e.target.value || null })} onBlur={() => onSave(price)} className="w-28 rounded-lg border border-transparent p-2 hover:border-ink/10" /></td>
    <td className="p-3"><input aria-label={`Unit for ${price.name}`} value={price.unit} onChange={(e) => onChange({ ...price, unit: e.target.value })} onBlur={() => onSave(price)} className="w-24 rounded-lg border border-transparent p-2 hover:border-ink/10" /></td>
    <td className="p-3"><button onClick={() => onRemove(price.id)} className="focus-ring grid h-11 w-11 place-items-center rounded-full text-red-600" aria-label="Remove fee"><Trash2 size={17} /></button></td>
  </tr>;
}
