"use client";

import { Check, ChevronLeft, ChevronRight, Clock3, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { doctors, services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { bookingSchema, bookingServiceSchema, bookingScheduleSchema } from "@/lib/booking-validation";
import { bookingTimeSlots, formatBookingDate, formatBookingTime, isBookableSlot, londonToday } from "@/lib/booking-time";
import { isValidUkPhone } from "@/lib/phone";
import { legacyDoctorSlugs } from "@/prisma/doctor-aliases";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { BookingCalendar } from "@/components/booking/booking-calendar";

type BookingFormProps = {
  initialService?: string;
  initialDoctor?: string;
  compact?: boolean;
};

type FormState = {
  serviceSlug: string;
  doctorSlug: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
  consent: boolean;
};

const initialState: FormState = {
  serviceSlug: "",
  doctorSlug: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
  comment: "",
  consent: false
};

export function BookingForm({ initialService = "", initialDoctor = "", compact = false }: BookingFormProps) {
  const id = useId();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => {
    const service = services.find((item) => item.slug === initialService);
    const doctor = doctors.find((item) => item.slug === (legacyDoctorSlugs[initialDoctor] || initialDoctor) && (!service || item.serviceSlugs.some((slug) => slug === service.slug)));
    return { ...initialState, serviceSlug: service?.slug || "", doctorSlug: doctor?.slug || "" };
  });
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState("");
  const formRoot = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const requestKey = useRef("");
  const submitting = useRef(false);
  const [now, setNow] = useState<Date | null>(null);
  const previousStep = useRef(1);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    formRoot.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    if (step === 4) successHeading.current?.focus();
  }, [step]);

  const selectedService = services.find((item) => item.slug === form.serviceSlug);
  const availableDoctors = useMemo(
    () => doctors.filter((doctor) => !form.serviceSlug || doctor.serviceSlugs.some((slug) => slug === form.serviceSlug)),
    [form.serviceSlug]
  );
  const selectedDoctor = doctors.find((item) => item.slug === form.doctorSlug);

  function patch(values: Partial<FormState>) {
    requestKey.current = "";
    setForm((current) => ({ ...current, ...values }));
    setError("");
    setInvalidField("");
  }

  function showValidationIssue(issue: { message: string; path: PropertyKey[] }) {
    const field = String(issue.path[0] || "");
    setError(issue.message);
    setInvalidField(field);
    formRoot.current?.querySelector<HTMLElement>(`[data-field="${field}"], [name="${field}"]`)?.focus();
  }

  function next() {
    const parsed = (step === 1 ? bookingServiceSchema : bookingScheduleSchema).safeParse(form);
    if (!parsed.success) return showValidationIssue(parsed.error.issues[0]);
    setError("");
    setStep((current) => Math.min(3, current + 1));
  }

  async function submit() {
    if (submitting.current) return;
    requestKey.current ||= crypto.randomUUID();
    const parsed = bookingSchema.safeParse({ ...form, idempotencyKey: requestKey.current });
    if (!parsed.success) {
      if (parsed.error.issues.some((issue) => issue.path[0] === "date" || issue.path[0] === "time")) setStep(2);
      return showValidationIssue(parsed.error.issues[0]);
    }
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(20_000)
      });
      const responseText = await response.text();
      let data: { error?: string; publicId?: string; fieldErrors?: Record<string, string> } = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText) as typeof data;
        } catch {
          throw new Error("Invalid response");
        }
      }
      if (!response.ok) {
        if (data.fieldErrors?.date || data.fieldErrors?.time) setStep(2);
        else if (data.fieldErrors?.serviceSlug || data.fieldErrors?.doctorSlug) setStep(1);
        setError(data.error || "We could not send your request. Please try again shortly.");
        return;
      }
      if (typeof data.publicId !== "string" || !data.publicId) throw new Error("Missing request reference");
      setResultId(data.publicId);
      setStep(4);
    } catch {
      setError("We could not check whether your request arrived. Please check your connection and try again; we will avoid creating a duplicate.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  if (step === 4) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-mint text-teal">
          <Check size={36} />
        </span>
        <span className="eyebrow mt-8">Request reference {resultId.slice(-6).toUpperCase()}</span>
        <h2 ref={successHeading} tabIndex={-1} className="display-title mt-4 text-3xl md:text-5xl">Thank you, {form.name.trim().split(/\s/)[0]}.</h2>
        <p className="mt-5 max-w-md leading-7 text-ink/65">
          Your request has been received. The team will contact you during opening hours to agree an appointment. Your preferred time is not confirmed yet.
        </p>
        <div className="mt-7 rounded-2xl bg-cream px-6 py-4 text-sm">
          {selectedService?.name} · {formatBookingDate(form.date)} · {formatBookingTime(form.time)}
        </div>
        <Button href="/" className="mt-8">Back to Home</Button>
      </div>
    );
  }

  return (
    <form ref={formRoot} noValidate aria-label="Appointment request" aria-busy={loading} aria-describedby={error ? `${id}-error` : undefined}
      onSubmit={(event) => { event.preventDefault(); if (step < 3) next(); else void submit(); }}
      className={cn("mx-auto w-full min-w-0", compact ? "max-w-4xl" : "max-w-5xl")}>
      <fieldset disabled={loading} className="min-w-0">
      <legend className="sr-only">Step {step} of 3</legend>
      <div className="mb-8 flex items-center gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-1 items-center gap-3">
            <span className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition",
              step >= item ? "bg-teal text-white" : "bg-ink/5 text-ink/40"
            )}>
              {step > item ? <Check size={15} /> : item}
            </span>
            <span className="hidden text-xs font-bold uppercase tracking-wider text-ink/50 sm:block">
              {item === 1 ? "Treatment" : item === 2 ? "Your visit" : "Your details"}
            </span>
            {item < 3 && <span className="h-px flex-1 bg-ink/10" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <span className="eyebrow">Step 1 of 3</span>
          <h2 className="display-title mt-3 text-3xl md:text-5xl">How can we help?</h2>
          <p className="mt-3 text-ink/60">Choose the treatment you would like to discuss. Your dentist will help you explore your options.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <button
                key={service.slug}
                data-autofocus={index === 0 ? true : undefined}
                type="button"
                aria-pressed={form.serviceSlug === service.slug}
                name="serviceSlug"
                onClick={() => patch({
                  serviceSlug: service.slug,
                  doctorSlug: selectedDoctor?.serviceSlugs.some((slug) => slug === service.slug) ? selectedDoctor.slug : ""
                })}
                className={cn(
                  "focus-ring flex min-h-28 items-center gap-4 rounded-2xl border p-5 text-left transition",
                  form.serviceSlug === service.slug
                    ? "border-teal bg-mint/60 shadow-sm"
                    : "border-ink/10 bg-white hover:border-sage"
                )}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-teal">
                  <ServiceIcon name={service.icon} size={21} />
                </span>
                <span className="font-bold">{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <span className="eyebrow">Step 2 of 3</span>
          <h2 className="display-title mt-3 text-3xl md:text-5xl">When would suit you?</h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">All times are London time (GMT or BST). Choose a preferred day and time; we will contact you to confirm availability.</p>
          <div className="mt-7 grid gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <label className="text-sm font-bold" htmlFor={`${id}-doctor`}>Preferred dentist</label>
              <select
                data-autofocus
                id={`${id}-doctor`}
                name="doctorSlug"
                value={form.doctorSlug}
                onChange={(event) => patch({ doctorSlug: event.target.value })}
                className="focus-ring mt-2 h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white px-4"
              >
                <option value="">No preference</option>
                {availableDoctors.map((doctor) => <option key={doctor.slug} value={doctor.slug}>{doctor.name}</option>)}
              </select>
              <BookingCalendar
                id={`${id}-date`}
                value={form.date}
                today={now ? londonToday(now) : null}
                invalid={invalidField === "date"}
                errorId={`${id}-error`}
                onChange={(date) => patch({ date, time: "" })}
              />
            </div>
            <div>
              <p className="text-sm font-bold">Preferred time of day</p>
              <div className="mt-2 grid gap-3">
                {bookingTimeSlots.map(({ value, label, range }) => (
                  <button
                    type="button"
                    key={value}
                    name="time"
                    disabled={!form.date || !now || !isBookableSlot(form.date, value, now)}
                    aria-pressed={form.time === value}
                    onClick={() => patch({ time: value })}
                    className={cn(
                      "focus-ring flex min-h-16 flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
                      form.time === value ? "border-teal bg-mint/60" : "border-ink/10 bg-white"
                    )}
                  >
                    <span className="font-bold capitalize">{label}</span>
                    <span className="flex items-center gap-2 text-sm text-ink/50"><Clock3 size={16} />{range}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <span className="eyebrow">Step 3 of 3</span>
          <h2 className="display-title mt-3 text-3xl md:text-5xl">How can we reach you?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Full name (required)
              <input
                data-autofocus
                maxLength={80}
                name="name"
                aria-invalid={invalidField === "name"}
                required
                value={form.name}
                onChange={(event) => patch({ name: event.target.value })}
                onBlur={() => !form.name.trim() && setError("Please enter your name.")}
                autoComplete="name"
                className="focus-ring mt-2 h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white px-4 font-normal"
                placeholder="e.g. Alex Taylor"
              />
            </label>
            <label className="text-sm font-bold">
              Phone number (required)
              <input
                value={form.phone}
                type="tel"
                name="phone"
                required
                aria-invalid={invalidField === "phone"}
                maxLength={40}
                onChange={(event) => patch({ phone: event.target.value })}
                onBlur={() => {
                  if (form.phone && !isValidUkPhone(form.phone)) {
                    setInvalidField("phone");
                    setError("Enter a UK mobile (07) or landline (01 or 02), or use +44 instead of the first 0.");
                  }
                }}
                inputMode="tel"
                autoComplete="tel"
                className="focus-ring mt-2 h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white px-4 font-normal"
                placeholder="e.g. 07700 900123"
              />
            </label>
            <label className="text-sm font-bold">
              Email address (optional)
              <input
                type="email"
                name="email"
                aria-invalid={invalidField === "email"}
                maxLength={160}
                value={form.email}
                onChange={(event) => patch({ email: event.target.value })}
                autoComplete="email"
                className="focus-ring mt-2 h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white px-4 font-normal"
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm font-bold">
              Note (optional)
              <input
                maxLength={500}
                name="comment"
                aria-invalid={invalidField === "comment"}
                value={form.comment}
                onChange={(event) => patch({ comment: event.target.value })}
                className="focus-ring mt-2 h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white px-4 font-normal"
                placeholder="Any access or communication needs?"
              />
            </label>
          </div>
          <p className="mt-4 text-xs leading-5 text-ink/70">Use a UK mobile (07), landline (01 or 02) or +44 number. Please save detailed medical information for your appointment.</p>
          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-5 text-ink/60">
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={invalidField === "consent"}
              checked={form.consent}
              onChange={(event) => patch({ consent: event.target.checked })}
              className="mt-0.5 h-4 w-4 accent-teal"
            />
            <span>I agree to be contacted about my appointment request and have read the <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="focus-ring rounded underline underline-offset-2">Privacy Notice (opens in a new tab)</Link>.</span>
          </label>
          <p className="mt-4 text-xs leading-5 text-ink/70">Portfolio demo: please use fictional contact details. This form does not book a real dental appointment.</p>
          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-ink/65">
            {selectedService?.name} · {selectedDoctor?.name || "No dentist preference"} · {formatBookingDate(form.date)}, {formatBookingTime(form.time)}
          </div>
        </div>
      )}

      {error && <p id={`${id}-error`} role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={() => { setError(""); setStep((current) => current - 1); }}>
            <ChevronLeft size={18} className="mr-1" /> Back
          </Button>
        ) : <span />}
        {step < 3 ? (
          <Button type="submit">
            Continue <ChevronRight size={18} className="ml-1" />
          </Button>
        ) : (
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : null}
            {loading ? "Sending your request…" : "Send Appointment Request"}
          </Button>
        )}
      </div>
      </fieldset>
    </form>
  );
}
