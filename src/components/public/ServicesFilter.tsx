"use client";

import Link from "next/link";
import { cn } from "@/lib/utilities/cn";
import type { ServiceAudienceFilter } from "@/types";

const filters: { value?: ServiceAudienceFilter; label: string }[] = [
  { label: "All" },
  { value: "family", label: "Family" },
  { value: "property", label: "Property" },
  { value: "business", label: "Business" },
  { value: "legacy", label: "Legacy" },
];

interface ServicesFilterProps {
  activeFilter?: ServiceAudienceFilter;
}

export function ServicesFilter({ activeFilter }: ServicesFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter services by audience"
    >
      {filters.map((filter) => {
        const href = filter.value ? `/services?filter=${filter.value}` : "/services";
        const isActive = filter.value === activeFilter || (!filter.value && !activeFilter);
        return (
          <Link
            key={filter.label}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              isActive
                ? "border-cyan/40 bg-cyan/10 text-cyan"
                : "border-border text-text-secondary hover:border-cyan/30 hover:text-text-primary",
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
