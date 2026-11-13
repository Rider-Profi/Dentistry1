"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const links = [
  ["Treatments", "/services"],
  ["Our Team", "/doctors"],
  ["Fees", "/prices"],
  ["Patient Reviews", "/reviews"]
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }

    const desktop = window.matchMedia("(min-width: 1024px)");
    function handleViewportChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    desktop.addEventListener("change", handleViewportChange);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      desktop.removeEventListener("change", handleViewportChange);
    };
  }, [open]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-[#fbfaf6]/95 backdrop-blur">
      <div className="container-shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className="focus-ring whitespace-nowrap rounded-md py-3 text-sm font-semibold text-ink/75 hover:text-teal aria-[current=page]:text-teal"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden shrink-0 items-center gap-5 md:flex lg:ml-0">
          <a
            href={siteConfig.phoneHref}
            className="focus-ring hidden whitespace-nowrap rounded-md py-3 text-sm font-bold text-ink xl:block"
            aria-label={`Call ${siteConfig.name} on ${siteConfig.phone}`}
          >
            {siteConfig.phone}
          </a>
          <Button href="/booking" className="whitespace-nowrap">Book an Appointment</Button>
        </div>
        <button
          ref={menuButton}
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/10 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        hidden={!open}
        className="max-h-[calc(100dvh-var(--header-height))] overflow-y-auto border-t border-ink/5 bg-[#fbfaf6] px-5 pb-6 pt-3 lg:hidden"
      >
        <nav className="flex flex-col" aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className="focus-ring rounded-md border-b border-ink/5 py-4 font-semibold aria-[current=page]:text-teal"
            >
              {label}
            </Link>
          ))}
        </nav>
        <a href={siteConfig.phoneHref} className="focus-ring mt-3 flex min-h-11 items-center gap-2 rounded-md font-bold">
          <Phone size={18} aria-hidden="true" /> {siteConfig.phone}
        </a>
        <div onClick={() => setOpen(false)}>
          <Button href="/booking" className="mt-3 w-full">Book an Appointment</Button>
        </div>
      </div>
    </header>
  );
}
