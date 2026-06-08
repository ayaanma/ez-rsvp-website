import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  const styles = {
    primary: "bg-gradient-to-r from-[#f000d8] via-[#c000d8] to-[#78eaf2] text-white shadow-lg shadow-fuchsia-200/70",
    secondary: "border border-black/10 bg-white text-[#11081f] hover:border-[#b000b8]/40",
    ghost: "bg-transparent text-[#11081f]/70 hover:text-[#b000b8]"
  };
  return <Link className={cn("pop-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black", styles[variant], className)} href={href}>{children}</Link>;
}
