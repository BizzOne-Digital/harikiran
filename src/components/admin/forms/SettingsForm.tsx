"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormShell } from "@/components/admin/FormShell";
import { updateSettings } from "@/actions/settings";

type SettingsData = {
  businessName: string;
  shortName: string;
  description: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  consultationUrl: string;
};

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsData>(initial);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await updateSettings(form);
    setLoading(false);
    if (result.success) {
      toast.success("Settings saved");
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormShell
        title="Business settings"
        backHref="/admin"
        footer={
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save settings"}
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              required
              value={form.businessName}
              onChange={(e) =>
                setForm({ ...form, businessName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortName">Short name</Label>
            <Input
              id="shortName"
              required
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessHours">Business hours</Label>
            <Input
              id="businessHours"
              value={form.businessHours}
              onChange={(e) =>
                setForm({ ...form, businessHours: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consultationUrl">Consultation URL</Label>
            <Input
              id="consultationUrl"
              value={form.consultationUrl}
              onChange={(e) =>
                setForm({ ...form, consultationUrl: e.target.value })
              }
            />
          </div>
        </div>
      </FormShell>
    </form>
  );
}
