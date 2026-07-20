"use client";

import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Plain wrapper — wrapping App Router page trees in motion causes
 * removeChild NotFoundErrors on client navigations.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return <div className={className}>{children}</div>;
}
