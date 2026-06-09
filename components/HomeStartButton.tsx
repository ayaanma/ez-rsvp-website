"use client";

import { useEffect, useState } from "react";
import { isLoggedIn } from "@/lib/auth-client";

export function HomeStartButton() {
  const [href, setHref] = useState("/signup");

  useEffect(() => {
    const syncHref = () => {
      setHref(isLoggedIn() ? "/dashboard" : "/signup");
    };

    syncHref();
    window.addEventListener("storage", syncHref);
    window.addEventListener("ez-auth-change", syncHref);

    return () => {
      window.removeEventListener("storage", syncHref);
      window.removeEventListener("ez-auth-change", syncHref);
    };
  }, []);

  return (
    <a className="btn btn-primary" href={href}>
      Let&apos;s get started →
    </a>
  );
}
