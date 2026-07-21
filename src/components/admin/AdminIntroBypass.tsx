"use client";

import { useLayoutEffect } from "react";

/** Clears the public intro veil if someone lands on admin with data-intro still pending. */
export function AdminIntroBypass({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.intro = "seen";
    document.body.style.overflow = "";
  }, []);

  return children;
}
