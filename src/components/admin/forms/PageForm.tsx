"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormShell } from "@/components/admin/FormShell";
import {
  StatusSelect,
  SlugField,
  SeoFieldsGroup,
  VisibilitySwitch,
} from "@/components/admin/FormFields";
import { slugify } from "@/lib/utilities/slug";
import { createPage, updatePage } from "@/actions/pages";

type PageImage = {
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
};

type PageFormData = {
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  visibility: boolean;
  bodyHtml: string;
  seo: { title?: string; description?: string };
  hero: {
    heading?: string;
    subheading?: string;
    eyebrow?: string;
    backgroundImage?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  images: PageImage[];
};

const emptyImages = (): PageImage[] =>
  Array.from({ length: 5 }, (_, i) => ({
    url: "",
    alt: "",
    caption: "",
    order: i,
  }));

const defaults: PageFormData = {
  title: "",
  slug: "",
  status: "draft",
  visibility: true,
  bodyHtml: "",
  seo: {},
  hero: {},
  images: emptyImages(),
};

function normalizeImages(images?: PageImage[]): PageImage[] {
  const base = emptyImages();
  if (!images?.length) return base;
  images.slice(0, 5).forEach((img, i) => {
    base[i] = {
      url: img.url || "",
      alt: img.alt || "",
      caption: img.caption || "",
      order: i,
    };
  });
  return base;
}

export function PageForm({
  initial,
  id,
}: {
  initial?: Partial<PageFormData> & { images?: PageImage[] };
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PageFormData>({
    ...defaults,
    ...initial,
    seo: { ...defaults.seo, ...initial?.seo },
    hero: { ...defaults.hero, ...initial?.hero },
    bodyHtml: initial?.bodyHtml ?? "",
    images: normalizeImages(initial?.images),
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      images: form.images
        .filter((img) => img.url.trim())
        .map((img, i) => ({ ...img, order: i })),
    };
    const result = id
      ? await updatePage(id, payload)
      : await createPage(payload);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Page updated" : "Page created");
      router.push("/admin/pages");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  function updateImage(index: number, patch: Partial<PageImage>) {
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = { ...images[index], ...patch };
      return { ...prev, images };
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit page" : "New page"}
        backHref="/admin/pages"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save page"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <SlugField
            value={form.slug}
            onChange={(slug) => setForm({ ...form, slug })}
            source={form.title}
          />
          <StatusSelect
            value={form.status}
            onChange={(status) =>
              setForm({ ...form, status: status as PageFormData["status"] })
            }
          />
          <div className="sm:col-span-2">
            <VisibilitySwitch
              checked={form.visibility}
              onChange={(visibility) => setForm({ ...form, visibility })}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-md border border-slate-100 p-4">
          <p className="text-sm font-medium text-slate-700">Hero section</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Eyebrow</Label>
              <Input
                value={form.hero.eyebrow || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, eyebrow: e.target.value },
                  })
                }
                placeholder="About us"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Heading</Label>
              <Input
                value={form.hero.heading || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, heading: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Subheading</Label>
              <Textarea
                rows={3}
                value={form.hero.subheading || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, subheading: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Hero background image URL</Label>
              <Input
                value={form.hero.backgroundImage || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, backgroundImage: e.target.value },
                  })
                }
                placeholder="https://… or /uploads/…"
              />
              <p className="text-xs text-slate-500">
                Paste a Cloudinary, Unsplash, or Media Library URL.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Primary CTA label</Label>
              <Input
                value={form.hero.primaryCtaLabel || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, primaryCtaLabel: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA link</Label>
              <Input
                value={form.hero.primaryCtaHref || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, primaryCtaHref: e.target.value },
                  })
                }
                placeholder="/contact"
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA label</Label>
              <Input
                value={form.hero.secondaryCtaLabel || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, secondaryCtaLabel: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA link</Label>
              <Input
                value={form.hero.secondaryCtaHref || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: { ...form.hero, secondaryCtaHref: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-slate-100 p-4">
          <Label htmlFor="bodyHtml">Page content (HTML allowed)</Label>
          <Textarea
            id="bodyHtml"
            rows={8}
            value={form.bodyHtml}
            onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
            placeholder="<p>Your page content…</p>"
          />
        </div>

        <div className="space-y-4 rounded-md border border-slate-100 p-4">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Page section images (up to 5)
            </p>
            <p className="text-xs text-slate-500">
              These appear beside content sections on the public page — not as a
              separate gallery. Upload via Media, then paste the URL.
            </p>
          </div>
          {form.images.map((img, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2"
            >
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase sm:col-span-2">
                Image {index + 1}
                {index === 0 ? " (featured large)" : ""}
              </p>
              <div className="space-y-1 sm:col-span-2">
                <Label>Image URL</Label>
                <Input
                  value={img.url}
                  onChange={(e) => updateImage(index, { url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1">
                <Label>Alt text</Label>
                <Input
                  value={img.alt || ""}
                  onChange={(e) => updateImage(index, { alt: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Caption</Label>
                <Input
                  value={img.caption || ""}
                  onChange={(e) =>
                    updateImage(index, { caption: e.target.value })
                  }
                />
              </div>
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  className="h-28 w-full rounded-md object-cover sm:col-span-2"
                />
              ) : null}
            </div>
          ))}
        </div>

        <SeoFieldsGroup
          seo={form.seo}
          onChange={(seo) => setForm({ ...form, seo })}
        />
      </FormShell>
    </form>
  );
}
