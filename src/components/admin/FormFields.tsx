"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CONTENT_STATUSES } from "@/config/site";

export function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SlugField({
  value,
  onChange,
  source,
}: {
  value: string;
  onChange: (v: string) => void;
  source?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={source ? "auto-from-title" : "slug"}
      />
    </div>
  );
}

export function VisibilitySwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={onChange} id="visibility" />
      <Label htmlFor="visibility">Visible on site</Label>
    </div>
  );
}

export function SeoFieldsGroup({
  seo,
  onChange,
}: {
  seo: { title?: string; description?: string };
  onChange: (seo: { title?: string; description?: string }) => void;
}) {
  return (
    <div className="space-y-4 rounded-md border border-slate-100 p-4">
      <p className="text-sm font-medium text-slate-700">SEO</p>
      <div className="space-y-2">
        <Label htmlFor="seo-title">Meta title</Label>
        <Input
          id="seo-title"
          value={seo.title || ""}
          onChange={(e) => onChange({ ...seo, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seo-desc">Meta description</Label>
        <Input
          id="seo-desc"
          value={seo.description || ""}
          onChange={(e) => onChange({ ...seo, description: e.target.value })}
        />
      </div>
    </div>
  );
}
