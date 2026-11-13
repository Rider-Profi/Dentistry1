"use client";

import { CalendarDays, LayoutDashboard, LogOut, Menu, Stethoscope, Tags, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Appointment requests", icon: CalendarDays },
  { href: "/admin/doctors", label: "Dentist profiles", icon: Stethoscope },
  { href: "/admin/prices", label: "Treatment fees", icon: Tags }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  const navigation = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <button type="button" className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden" onClick={() => setOpen(false)} aria-label="Close administration menu"><X /></button>
      </div>
      <nav className="mt-10 grid gap-2" aria-label="Administration">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={cn("focus-ring flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold", active ? "bg-mint text-teal" : "text-ink/60 hover:bg-cream")}><Icon size={19} />{label}</Link>;
        })}
      </nav>
      <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="focus-ring mt-10 flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-ink/60 hover:bg-cream"><LogOut size={19} />Sign out</button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 overflow-y-auto border-r border-ink/10 bg-white p-6 lg:block">{navigation}</aside>
      {open && <Modal label="Administration menu" onClose={() => setOpen(false)} className="ml-0 mr-auto h-dvh max-h-dvh w-72 max-w-[calc(100%-1rem)] rounded-l-none"><div className="p-5">{navigation}</div></Modal>}
      <div className="min-w-0 lg:pl-72">
        <header className="flex min-h-20 items-center gap-3 border-b border-ink/10 bg-white px-5 lg:hidden">
          <button type="button" className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full" onClick={() => setOpen(true)} aria-label="Open administration menu" aria-expanded={open}><Menu /></button>
          <span className="text-sm font-bold">Practice administration</span>
        </header>
        <main className="min-w-0 p-4 sm:p-5 md:p-9">{children}</main>
      </div>
    </div>
  );
}
