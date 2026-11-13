import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display-title mt-4 text-4xl leading-tight md:text-6xl">{title}</h2>
      {children && <div className="mt-5 leading-7 text-ink/60">{children}</div>}
    </div>
  );
}
