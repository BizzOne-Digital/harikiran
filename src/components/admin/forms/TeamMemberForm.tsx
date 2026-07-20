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
import { StatusSelect } from "@/components/admin/FormFields";
import { createTeamMember, updateTeamMember } from "@/actions/team";

type TeamMemberFormData = {
  name: string;
  role: string;
  shortBio: string;
  fullBio: string;
  email: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  sortOrder: number;
};

const defaults: TeamMemberFormData = {
  name: "",
  role: "",
  shortBio: "",
  fullBio: "",
  email: "",
  status: "draft",
  featured: false,
  sortOrder: 0,
};

export function TeamMemberForm({
  initial,
  id,
}: {
  initial?: Partial<TeamMemberFormData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TeamMemberFormData>({ ...defaults, ...initial });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = id
      ? await updateTeamMember(id, form)
      : await createTeamMember(form);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "Team member updated" : "Team member created");
      router.push("/admin/team");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit team member" : "New team member"}
        backHref="/admin/team"
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <StatusSelect
            value={form.status}
            onChange={(status) =>
              setForm({ ...form, status: status as TeamMemberFormData["status"] })
            }
          />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="shortBio">Short bio</Label>
            <Textarea
              id="shortBio"
              value={form.shortBio}
              onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullBio">Full bio</Label>
            <Textarea
              id="fullBio"
              rows={6}
              value={form.fullBio}
              onChange={(e) => setForm({ ...form, fullBio: e.target.value })}
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
