"use client";

import DOMPurify from "isomorphic-dompurify";

interface RichHtmlProps {
  html: string;
  className?: string;
}

export function RichHtml({ html, className }: RichHtmlProps) {
  if (!html?.trim()) return null;
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  return (
    <div
      className={
        className ||
        "prose prose-invert max-w-none prose-headings:font-display prose-p:text-text-secondary prose-a:text-sky"
      }
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
