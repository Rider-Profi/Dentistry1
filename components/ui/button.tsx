import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "light";
  className?: string;
};

export function Button({ children, href, variant = "primary", className, ...props }: Props) {
  const styles = cn(
    "focus-ring inline-flex max-w-full min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-sm font-bold leading-snug transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-teal text-white hover:-translate-y-0.5 hover:bg-ink",
    variant === "secondary" && "border border-teal/20 bg-white text-ink hover:border-teal hover:text-teal",
    variant === "ghost" && "text-ink hover:bg-mint/60",
    variant === "light" && "bg-white text-ink hover:-translate-y-0.5 hover:bg-cream",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
