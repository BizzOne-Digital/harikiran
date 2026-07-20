"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormShell } from "@/components/admin/FormShell";
import { createUser, updateUser } from "@/actions/users";
import { USER_ROLES } from "@/config/site";
import type { UserRole } from "@/types";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const defaults: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "editor",
};

export function UserForm({
  initial,
  id,
}: {
  initial?: Partial<UserFormData>;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<UserFormData>({ ...defaults, ...initial });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = id
      ? await updateUser(id, { name: form.name, role: form.role })
      : await createUser(form);
    setLoading(false);
    if (result.success) {
      toast.success(id ? "User updated" : "User created");
      router.push("/admin/users");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title={id ? "Edit user" : "New user"}
        backHref="/admin/users"
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
          {!id && (
            <>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={10}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(role) =>
                setForm({ ...form, role: role as UserRole })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormShell>
    </form>
  );
}
