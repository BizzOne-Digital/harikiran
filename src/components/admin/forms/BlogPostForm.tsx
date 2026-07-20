"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormShell } from "@/components/admin/FormShell";
import { StatusSelect, SlugField } from "@/components/admin/FormFields";
import { slugify } from "@/lib/utilities/slug";
import { createBlogPost, updateBlogPost } from "@/actions/blog";

type BlogPostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  authorName: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  tags: string[];
};

const defaults: BlogPostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  authorName: "",
  status: "draft",
  featured: false,
  tags: [],
};

export function BlogPostForm({
  initial,
  id,
}: {
  initial?: Partial<BlogPostFormData> & {
    tags?: string[];
    coverImage?: { url?: string; alt?: string };
  };
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostFormData>({
    ...defaults,
    ...initial,
    coverImageUrl: initial?.coverImageUrl || initial?.coverImage?.url || "",
    coverImageAlt: initial?.coverImageAlt || initial?.coverImage?.alt || "",
  });
  const [tagsInput, setTagsInput] = useState(
    (initial?.tags || []).join(", "),
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      authorName: form.authorName,
      status: form.status,
      featured: form.featured,
      tags,
      coverImage: form.coverImageUrl.trim()
        ? {
            url: form.coverImageUrl.trim(),
            alt: form.coverImageAlt.trim() || undefined,
          }
        : undefined,
    };
    const result = id
      ? await updateBlogPost(id, payload)
      : await createBlogPost(payload);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit post" : "New post"}
        backHref="/admin/blog"
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
              setForm({ ...form, status: status as BlogPostFormData["status"] })
            }
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              required
              value={form.excerpt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, excerpt: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={10}
              value={form.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="coverImageUrl">Cover image URL</Label>
            <Input
              id="coverImageUrl"
              value={form.coverImageUrl}
              onChange={(e) =>
                setForm({ ...form, coverImageUrl: e.target.value })
              }
              placeholder="https://… (listing + detail page)"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="coverImageAlt">Cover alt text</Label>
            <Input
              id="coverImageAlt"
              value={form.coverImageAlt}
              onChange={(e) =>
                setForm({ ...form, coverImageAlt: e.target.value })
              }
            />
          </div>
          {form.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImageUrl}
              alt={form.coverImageAlt || ""}
              className="h-36 w-full rounded-md object-cover sm:col-span-2"
            />
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="authorName">Author name</Label>
            <Input
              id="authorName"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="insurance, mortgage, planning"
            />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
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
