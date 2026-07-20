import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PageHeader({
  title,
  description,
  action,
  actionHref,
  actionLabel = "Create",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action ??
        (actionHref ? (
          <Button asChild>
            <Link href={actionHref}>
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Link>
          </Button>
        ) : null)}
    </div>
  );
}
