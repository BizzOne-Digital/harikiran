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
import { createTestimonial, updateTestimonial } from "@/actions/testimonials";

type TestimonialFormData = {
  clientName: string;
  company: string;
  testimonial: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  sortOrder: number;
};

const defaults: TestimonialFormData = {
  clientName: "",
  company: "",
  testimonial: "",
  rating: 5,
  approved: false,
  featured: false,
  sortOrder: 0,
};

export function TestimonialForm({
  initial,
  id,
}: {
  initial?: Partial<TestimonialFormData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialFormData>({ ...defaults, ...initial });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = id
      ? await updateTestimonial(id, form)
      : await createTestimonial(form);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit testimonial" : "New testimonial"}
        backHref="/admin/testimonials"
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
          <div className="space-y-2">
            <Label htmlFor="clientName">Client name</Label>
            <Input
              id="clientName"
              required
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="testimonial">Testimonial</Label>
            <Textarea
              id="testimonial"
              required
              rows={5}
              value={form.testimonial}
              onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input
              id="rating"
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
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
              id="approved"
              checked={form.approved}
              onCheckedChange={(approved) => setForm({ ...form, approved })}
            />
            <Label htmlFor="approved">Approved</Label>
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
