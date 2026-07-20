"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/blog";
import { slugify } from "@/lib/utilities/slug";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
};

export function CategoriesClient({ items }: { items: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      sortOrder: category.sortOrder ?? 0,
    });
    setOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };
    const result = editingId
      ? await updateCategory(editingId, payload)
      : await createCategory(payload);
    setLoading(false);
    if (result.success) {
      toast.success(editingId ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteCategory(deleteId);
    setLoading(false);
    if (result.success) {
      toast.success("Category deleted");
      setDeleteOpen(false);
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New category
        </Button>
      </div>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No categories yet"
        emptyDescription="Create blog categories to organize posts."
        columns={[
          { key: "name", header: "Name", cell: (r) => r.name },
          { key: "slug", header: "Slug", cell: (r) => r.slug },
          {
            key: "sortOrder",
            header: "Order",
            cell: (r) => r.sortOrder ?? 0,
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDeleteId(r._id);
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit category" : "New category"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-from-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-order">Sort order</Label>
              <Input
                id="cat-order"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSave}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete category"
        description="This will permanently delete the category."
        confirmLabel="Delete"
        destructive
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}
