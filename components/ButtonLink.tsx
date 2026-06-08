import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: Route;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-[#272932] text-white shadow-sm hover:shadow-md",
    secondary:
      "border border-black/10 bg-white text-[#11081f] hover:border-[#9D79BC]/40 hover:shadow-sm",
    ghost:
      "bg-transparent text-[#11081f]/70 hover:text-[#272932]",
  };

  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200",
        styles[variant],
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}