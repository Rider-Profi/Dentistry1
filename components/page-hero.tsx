import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-mint/50 py-20 md:py-28">
      <div className="container-shell max-w-4xl text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-title mt-5 text-5xl leading-[1.02] md:text-7xl">{title}</h1>
        {children && <div className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/65">{children}</div>}
      </div>
    </section>
  );
}
