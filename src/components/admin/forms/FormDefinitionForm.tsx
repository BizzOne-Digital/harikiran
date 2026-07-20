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
import { upsertForm } from "@/actions/forms";

type FormDefinitionData = {
  key: string;
  name: string;
  description: string;
  notifyEmail: string;
  enabled: boolean;
};

const defaults: FormDefinitionData = {
  key: "",
  name: "",
  description: "",
  notifyEmail: "",
  enabled: true,
};

export function FormDefinitionForm({
  initial,
  id,
}: {
  initial?: Partial<FormDefinitionData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormDefinitionData>({
    ...defaults,
    ...initial,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await upsertForm(form);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Form updated" : "Form created");
      router.push("/admin/forms");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit form" : "New form"}
        backHref="/admin/forms"
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
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              required
              disabled={!!id}
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="consultation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notifyEmail">Notification email</Label>
            <Input
              id="notifyEmail"
              type="email"
              value={form.notifyEmail}
              onChange={(e) =>
                setForm({ ...form, notifyEmail: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch
              id="enabled"
              checked={form.enabled}
              onCheckedChange={(enabled) => setForm({ ...form, enabled })}
            />
            <Label htmlFor="enabled">Enabled</Label>
          </div>
        </div>
      </FormShell>
    </form>
  );
}
