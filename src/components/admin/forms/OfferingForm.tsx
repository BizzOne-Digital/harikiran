"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormShell } from "@/components/admin/FormShell";
import { StatusSelect, SlugField } from "@/components/admin/FormFields";
import { slugify } from "@/lib/utilities/slug";
import { createOffering, updateOffering } from "@/actions/offerings";
import type { OfferingType } from "@/types";

type OfferingFormData = {
  name: string;
  slug: string;
  type: OfferingType;
  shortDescription: string;
  fullDescription: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  sortOrder: number;
};

const defaults: OfferingFormData = {
  name: "",
  slug: "",
  type: "service",
  shortDescription: "",
  fullDescription: "",
  status: "draft",
  featured: false,
  sortOrder: 0,
};

export function OfferingForm({
  initial,
  id,
}: {
  initial?: Partial<OfferingFormData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<OfferingFormData>({ ...defaults, ...initial });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
    };
    const result = id
      ? await updateOffering(id, payload)
      : await createOffering(payload);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Offering updated" : "Offering created");
      router.push("/admin/offerings");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit offering" : "New offering"}
        backHref="/admin/offerings"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(slug) => setForm({ ...form, slug })}
            source={form.name}
          />
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(type) =>
                setForm({ ...form, type: type as OfferingType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="program">Program</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <StatusSelect
            value={form.status}
            onChange={(status) =>
              setForm({ ...form, status: status as OfferingFormData["status"] })
            }
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Input
              id="shortDescription"
              required
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullDescription">Full description</Label>
            <Textarea
              id="fullDescription"
              rows={6}
              value={form.fullDescription}
              onChange={(e) =>
                setForm({ ...form, fullDescription: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={form.featured}
              onCheckedChange={(featured) => setForm({ ...form, featured })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>
      </FormShell>
    </form>
  );
}
