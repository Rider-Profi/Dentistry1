"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { BookingForm } from "@/components/booking/booking-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [modal, setModal] = useState<{ service?: string; doctor?: string } | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setModal(null); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.current?.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex='0']") || [])
        .filter((element) => element.getClientRects().length > 0 && !element.matches(":disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      const returnTarget = trigger.current?.getClientRects().length ? trigger.current : document.querySelector<HTMLElement>("[aria-controls='mobile-navigation']");
      returnTarget?.focus({ preventScroll: true });
    };
  }, [modal]);

  function captureBooking(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin || url.pathname !== "/booking" || pathname === "/booking") return;
    event.preventDefault();
    trigger.current = anchor;
    setModal({
      service: url.searchParams.get("service") || undefined,
      doctor: url.searchParams.get("doctor") || undefined
    });
  }

  if (isAdmin) return <>{children}</>;
  return (
    <div onClickCapture={captureBooking}>
      <div inert={!!modal}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      </div>
      {modal && (
        <div ref={dialog} role="dialog" aria-modal="true" aria-label="Appointment request" className="fixed inset-0 z-[100] overflow-y-auto bg-ink/55 md:p-6">
          <div className="relative min-h-full bg-[#fbfaf6] p-5 pt-20 md:mx-auto md:min-h-0 md:max-w-5xl md:rounded-4xl md:p-12">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="focus-ring absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white"
              aria-label="Close appointment form"
            >
              <X size={20} />
            </button>
            <BookingForm initialService={modal.service} initialDoctor={modal.doctor} />
          </div>
        </div>
      )}
    </div>
  );
}
