"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { toggleFormEnabled, deleteForm } from "@/actions/forms";

type FormItem = {
  _id: string;
  key: string;
  name: string;
  notifyEmail?: string;
  enabled: boolean;
};

export function FormsListClient({ items }: { items: FormItem[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleToggle(id: string, enabled: boolean) {
    const result = await toggleFormEnabled(id, enabled);
    if (result.success) {
      toast.success(enabled ? "Form enabled" : "Form disabled");
      router.refresh();
    } else {
      toast.error(result.error || "Toggle failed");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteForm(deleteId);
    setLoading(false);
    if (result.success) {
      toast.success("Form deleted");
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  return (
    <>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No forms defined"
        emptyDescription="Create form definitions for site submissions."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <Link
                href={`/admin/forms/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.name}
              </Link>
            ),
          },
          { key: "key", header: "Key", cell: (r) => r.key },
          {
            key: "notifyEmail",
            header: "Notify email",
            cell: (r) => r.notifyEmail || "—",
          },
          {
            key: "enabled",
            header: "Enabled",
            cell: (r) => (
              <Switch
                checked={r.enabled}
                onCheckedChange={(enabled) => handleToggle(r._id, enabled)}
              />
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/forms/${r._id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(r._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ),
          },
        ]}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete form"
        description="This will permanently delete the form definition."
        confirmLabel="Delete"
        destructive
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}
