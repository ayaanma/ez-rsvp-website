"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { getStoredUser, isLoggedIn } from "@/lib/auth-client";

export function HomeStartButton() {
  const [href, setHref] = useState<Route>("/signup");

  useEffect(() => {
    if (getStoredUser() || isLoggedIn()) {
      setHref("/dashboard");
    }
  }, []);

  return (
    <Link className="btn btn-primary" href={href}>
      Let&apos;s get started →
    </Link>
  );
}
