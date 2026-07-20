"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { deleteMediaAsset, updateMediaAsset } from "@/actions/media";

type MediaItem = {
  _id: string;
  url: string;
  originalName: string;
  alt?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
};

export function MediaClient({
  items,
  page,
  totalPages,
}: {
  items: MediaItem[];
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");
      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.success) successCount++;
        else toast.error(data.error || `Failed to upload ${file.name}`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file(s)`);
      router.refresh();
    }
  }

  function openEdit(item: MediaItem) {
    setEditItem(item);
    setAltText(item.alt || "");
  }

  async function handleSaveAlt() {
    if (!editItem) return;
    setLoading(true);
    const result = await updateMediaAsset(editItem._id, { alt: altText });
    setLoading(false);
    if (result.success) {
      toast.success("Alt text updated");
      setEditItem(null);
      router.refresh();
    } else {
      toast.error(result.error || "Update failed");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteMediaAsset(deleteId);
    setLoading(false);
    if (result.success) {
      toast.success("Media deleted");
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div>
      <ListToolbar placeholder="Search media…" />
      <div className="mb-4 flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload files"}
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-medium text-slate-900">No media yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload images and files to use across the site.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="relative aspect-square bg-slate-50">
                {isImage(item.mimeType) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    {item.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-end gap-1 bg-black/0 p-2 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeleteId(item._id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-slate-900">
                  {item.originalName}
                </p>
                <p className="text-xs text-slate-400">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <PaginationBar page={page} totalPages={totalPages} />
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit alt text</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="alt">Alt text</Label>
            <Input
              id="alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSaveAlt}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete media"
        description="This will permanently remove the file from storage."
        confirmLabel="Delete"
        destructive
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
