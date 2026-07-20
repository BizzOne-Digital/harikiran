"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormShell } from "@/components/admin/FormShell";
import { StatusSelect } from "@/components/admin/FormFields";
import { createFaq, updateFaq } from "@/actions/faqs";

type FaqFormData = {
  question: string;
  answer: string;
  category: string;
  status: "draft" | "published" | "archived";
  sortOrder: number;
};

const defaults: FaqFormData = {
  question: "",
  answer: "",
  category: "General",
  status: "draft",
  sortOrder: 0,
};

export function FaqForm({
  initial,
  id,
  categories = [],
}: {
  initial?: Partial<FaqFormData>;
  id?: string;
  categories?: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FaqFormData>({ ...defaults, ...initial });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = id ? await updateFaq(id, form) : await createFaq(form);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "FAQ updated" : "FAQ created");
      router.push("/admin/faqs");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit FAQ" : "New FAQ"}
        backHref="/admin/faqs"
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
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              required
              rows={6}
              value={form.answer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, answer: e.target.value })
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                required
                list="faq-categories"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <datalist id="faq-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <StatusSelect
              value={form.status}
              onChange={(status) =>
                setForm({ ...form, status: status as FaqFormData["status"] })
              }
            />
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
          </div>
        </div>
      </FormShell>
    </form>
  );
}
