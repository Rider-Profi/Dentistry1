"use client";

import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type Service = { id: number; name: string };
type Doctor = {
  id: number;
  slug: string;
  name: string;
  position: string;
  specialties: string[];
  experience: number;
  photoUrl: string;
  photoPublicId: string | null;
  description: string;
  education: string[];
  certificates: string[];
  isActive: boolean;
  services: Service[];
};

const empty = {
  slug: "", name: "", position: "", specialties: "", experience: 0,
  photoUrl: "/avatars/emily-smith.svg", photoPublicId: "", description: "", education: "",
  certificates: "", serviceIds: [] as number[], isActive: true
};

export function DoctorsManager({ initialDoctors, services }: { initialDoctors: Doctor[]; services: Service[] }) {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [editing, setEditing] = useState<Doctor | null | "new">(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function begin(doctor?: Doctor) {
    setEditing(doctor || "new");
    setForm(doctor ? {
      slug: doctor.slug,
      name: doctor.name,
      position: doctor.position,
      specialties: doctor.specialties.join(", "),
      experience: doctor.experience,
      photoUrl: doctor.photoUrl,
      photoPublicId: doctor.photoPublicId || "",
      description: doctor.description,
      education: doctor.education.join("\n"),
      certificates: doctor.certificates.join("\n"),
      serviceIds: doctor.services.map((service) => service.id),
      isActive: doctor.isActive
    } : empty);
    setError("");
  }

  async function upload(file: File) {
    setSaving(true);
    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", { method: "POST" });
      const signature = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signature.error || "Image uploads are unavailable. Please try again later.");
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", signature.apiKey);
      data.append("timestamp", String(signature.timestamp));
      data.append("signature", signature.signature);
      data.append("folder", signature.folder);
      const result = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, { method: "POST", body: data }).then((response) => response.json());
      if (!result.secure_url) throw new Error(result.error?.message || "We could not upload this image. Please try again.");
      setForm((current) => ({ ...current, photoUrl: result.secure_url, photoPublicId: result.public_id }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "We could not upload this image. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    setSaving(true);
    setError("");
    const body = {
      ...form,
      specialties: form.specialties.split(",").map((value) => value.trim()).filter(Boolean),
      education: form.education.split("\n").map((value) => value.trim()).filter(Boolean),
      certificates: form.certificates.split("\n").map((value) => value.trim()).filter(Boolean),
      photoPublicId: form.photoPublicId || null
    };
    const isNew = editing === "new";
    try {
      const response = await fetch(isNew ? "/api/doctors" : `/api/doctors/${(editing as Doctor).id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (!response.ok) {
        setError(typeof result.error === "string" ? result.error : "Please check the profile details and try again.");
      } else {
        setDoctors((current) => isNew ? [...current, result] : current.map((item) => item.id === result.id ? result : item));
        setEditing(null);
      }
    } catch {
      setError("Could not save this profile. Please check your connection and try again.");
    } finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!window.confirm("Hide this profile and delete its uploaded Cloudinary image?")) return;
    try {
      const response = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not remove this profile.");
      setDoctors((current) => current.filter((doctor) => doctor.id !== id));
    } catch { setError("Could not remove this profile. Please try again."); }
  }

  return (
    <>
      <div className="mt-8 flex justify-end"><Button onClick={() => begin()}><Plus size={18} className="mr-2" /> Add a dentist</Button></div>
      {error && !editing && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-5 grid gap-4">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="grid gap-5 rounded-3xl bg-white p-5 sm:grid-cols-[90px_1fr_auto] sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-mint">
              <Image src={doctor.photoUrl} alt="" fill className="object-cover" sizes="96px" />
            </div>
            <div><h2 className="display-title text-2xl">{doctor.name}</h2><p className="mt-1 text-sm text-ink/55">{doctor.position}</p><p className="mt-3 text-xs font-bold text-teal">{doctor.isActive ? "Visible" : "Hidden"}</p></div>
            <div className="flex gap-2">
              <button onClick={() => begin(doctor)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/10" aria-label="Edit profile"><Pencil size={17} /></button>
              <button onClick={() => remove(doctor.id)} className="grid h-11 w-11 place-items-center rounded-full border border-red-100 text-red-600" aria-label="Remove"><Trash2 size={17} /></button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <Modal label={editing === "new" ? "New dentist profile" : "Edit dentist profile"} onClose={() => setEditing(null)}>
          <div className="p-5 md:p-8">
            <div className="flex items-start justify-between gap-3"><h2 className="display-title text-3xl">{editing === "new" ? "New dentist profile" : "Edit dentist profile"}</h2><button className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full" aria-label="Close profile editor" onClick={() => setEditing(null)}><X /></button></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} set={(name) => setForm({ ...form, name })} />
              <Field label="Slug" value={form.slug} set={(slug) => setForm({ ...form, slug })} />
              <Field label="Role" value={form.position} set={(position) => setForm({ ...form, position })} />
              <Field label="Experience (years)" value={String(form.experience)} type="number" set={(value) => setForm({ ...form, experience: Number(value) })} />
              <Field label="Areas of interest (comma-separated)" value={form.specialties} set={(specialties) => setForm({ ...form, specialties })} />
              <label className="text-sm font-bold">Profile image
                <span className="mt-2 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-teal text-teal"><ImagePlus size={18} /> Upload image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                </span>
              </label>
              <label className="text-sm font-bold sm:col-span-2">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-ink/10 p-4 font-normal" /></label>
              <label className="text-sm font-bold">Background (one entry per line)<textarea value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-ink/10 p-4 font-normal" /></label>
              <label className="text-sm font-bold">Development interests (one entry per line)<textarea value={form.certificates} onChange={(e) => setForm({ ...form, certificates: e.target.value })} className="mt-2 min-h-28 w-full rounded-2xl border border-ink/10 p-4 font-normal" /></label>
            </div>
            <fieldset className="mt-5"><legend className="text-sm font-bold">Treatments</legend><div className="mt-3 flex flex-wrap gap-3">{services.map((service) => <label key={service.id} className="flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm"><input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={(e) => setForm({ ...form, serviceIds: e.target.checked ? [...form.serviceIds, service.id] : form.serviceIds.filter((id) => id !== service.id) })} />{service.name}</label>)}</div></fieldset>
            <label className="mt-5 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show on the website</label>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="mt-7 flex justify-end"><Button onClick={save} disabled={saving}>{saving && <Loader2 size={18} className="mr-2 animate-spin" />} Save profile</Button></div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Field({ label, value, set, type = "text" }: { label: string; value: string; set: (value: string) => void; type?: string }) {
  return <label className="text-sm font-bold">{label}<input type={type} value={value} onChange={(e) => set(e.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-ink/10 px-4 font-normal" /></label>;
}
