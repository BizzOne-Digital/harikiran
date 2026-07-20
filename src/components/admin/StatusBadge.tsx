import { Badge } from "@/components/ui/badge";
import type { ContentStatus, LeadStatus } from "@/types";

const contentStatusMap: Record<
  ContentStatus,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  published: { label: "Published", variant: "success" },
  archived: { label: "Archived", variant: "outline" },
};

const leadStatusMap: Record<
  LeadStatus,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  qualified: { label: "Qualified", variant: "success" },
  "follow-up": { label: "Follow-up", variant: "warning" },
  converted: { label: "Converted", variant: "success" },
  closed: { label: "Closed", variant: "outline" },
  spam: { label: "Spam", variant: "destructive" },
};

export function StatusBadge({
  status,
  type = "content",
}: {
  status: string;
  type?: "content" | "lead";
}) {
  const map = type === "lead" ? leadStatusMap : contentStatusMap;
  const config =
    (map as Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }>)[status] ?? {
      label: status,
      variant: "outline" as const,
    };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
