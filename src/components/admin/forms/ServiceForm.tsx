"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormShell } from "../FormShell";
import { StatusSelect, SlugField, SeoFieldsGroup } from "../FormFields";
import { slugify } from "@/lib/utilities/slug";
import {
  createService,
  updateService,
} from "@/actions/services";

type ServiceFormData = {
  name: string;
  slug: string;
  shortDescription: string;
  summary: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  group: "protection" | "financing" | "future-legacy";
  status: "draft" | "published" | "archived";
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  sortOrder: number;
  seo: { title?: string; description?: string };
};

const defaults: ServiceFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  summary: "",
  content: "",
  imageUrl: "",
  imageAlt: "",
  group: "protection",
  status: "draft",
  ctaLabel: "Book a Free Consultation",
  ctaHref: "/contact",
  featured: false,
  sortOrder: 0,
  seo: {},
};

export function ServiceForm({
  initial,
  id,
}: {
  initial?: Partial<ServiceFormData> & {
    image?: { url?: string; alt?: string };
  };
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceFormData>({
    ...defaults,
    ...initial,
    imageUrl: initial?.imageUrl || initial?.image?.url || "",
    imageAlt: initial?.imageAlt || initial?.image?.alt || "",
    seo: { ...defaults.seo, ...initial?.seo },
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      image: form.imageUrl.trim()
        ? { url: form.imageUrl.trim(), alt: form.imageAlt.trim() || undefined }
        : undefined,
    };
    const { imageUrl: _u, imageAlt: _a, ...rest } = payload;
    void _u;
    void _a;
    const result = id
      ? await updateService(id, rest)
      : await createService(rest);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit service" : "New service"}
        backHref="/admin/services"
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
          <StatusSelect
            value={form.status}
            onChange={(status) =>
              setForm({ ...form, status: status as ServiceFormData["status"] })
            }
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="short">Short description</Label>
            <Input
              id="short"
              required
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="imageUrl">Solution image URL</Label>
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://… (shown on listing + detail page)"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="imageAlt">Image alt text</Label>
            <Input
              id="imageAlt"
              value={form.imageAlt}
              onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
            />
          </div>
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.imageUrl}
              alt={form.imageAlt || ""}
              className="h-36 w-full rounded-md object-cover sm:col-span-2"
            />
          ) : null}
        </div>
        <SeoFieldsGroup
          seo={form.seo}
          onChange={(seo) => setForm({ ...form, seo })}
        />
      </FormShell>
    </form>
  );
}
