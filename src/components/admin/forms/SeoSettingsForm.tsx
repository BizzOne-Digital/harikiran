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
import { updateSeoSettings } from "@/actions/seo";

type SeoSettingsData = {
  title: string;
  description: string;
  keywords: string[];
  titleTemplate: string;
  robotsIndex: boolean;
};

export function SeoSettingsForm({ initial }: { initial: SeoSettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState<SeoSettingsData>(initial);
  const [keywordsInput, setKeywordsInput] = useState(
    (initial.keywords || []).join(", "),
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const result = await updateSeoSettings({ ...form, keywords });
    setLoading(false);
    if (result.success) {
      toast.success("SEO settings saved");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="SEO settings"
        backHref="/admin"
        footer={
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save settings"}
          </Button>
        }
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Default title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleTemplate">Title template</Label>
            <Input
              id="titleTemplate"
              value={form.titleTemplate}
              onChange={(e) =>
                setForm({ ...form, titleTemplate: e.target.value })
              }
              placeholder="%s | TopAdvice4U"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Default description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="robotsIndex"
              checked={form.robotsIndex}
              onCheckedChange={(robotsIndex) =>
                setForm({ ...form, robotsIndex })
              }
            />
            <Label htmlFor="robotsIndex">Allow search engine indexing</Label>
          </div>
        </div>
      </FormShell>
    </form>
  );
}
