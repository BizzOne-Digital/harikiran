"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type DeleteAction = (
  id: string,
) => Promise<{ success: boolean; error?: string }>;

/**
 * Pass a Server Action reference + id — never an inline () => deleteX(id)
 * from a Server Component (that cannot be serialized to the client).
 */
export function RowActions({
  editHref,
  id,
  deleteAction,
  deleteLabel = "Delete",
}: {
  editHref: string;
  id: string;
  deleteAction: DeleteAction;
  deleteLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" asChild>
        <Link href={editHref}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={deleteLabel}
        description="This action can be reversed only by restoring from backups. The record will be soft-deleted."
        confirmLabel={deleteLabel}
        destructive
        loading={loading}
        onConfirm={async () => {
          setLoading(true);
          try {
            const result = await deleteAction(id);
            if (result.success) {
              toast.success("Deleted successfully");
              router.refresh();
            } else {
              toast.error(result.error || "Delete failed");
            }
          } catch {
            toast.error("Delete failed");
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
