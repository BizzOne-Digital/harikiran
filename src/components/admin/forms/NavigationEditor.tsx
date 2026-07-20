"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertNavigationMenu } from "@/actions/navigation";
import type { NavLink } from "@/types";
import { Plus, Trash2, GripVertical } from "lucide-react";

type MenuKey = "header" | "footer" | "mobile";

type MenuData = {
  key: MenuKey;
  label: string;
  items: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

const menuLabels: Record<MenuKey, string> = {
  header: "Header menu",
  footer: "Footer menu",
  mobile: "Mobile menu",
};

const emptyLink = (): NavLink => ({
  label: "",
  href: "",
  openInNewTab: false,
  visible: true,
});

export function NavigationEditor({
  menus,
}: {
  menus: Partial<Record<MenuKey, MenuData>>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MenuKey>("header");
  const [data, setData] = useState<Record<MenuKey, MenuData>>({
    header: {
      key: "header",
      label: "Header",
      items: menus.header?.items || [],
      ctaLabel: menus.header?.ctaLabel,
      ctaHref: menus.header?.ctaHref,
    },
    footer: {
      key: "footer",
      label: "Footer",
      items: menus.footer?.items || [],
    },
    mobile: {
      key: "mobile",
      label: "Mobile",
      items: menus.mobile?.items || [],
    },
  });
  const [loading, setLoading] = useState(false);

  const menu = data[activeTab];

  function updateItem(index: number, patch: Partial<NavLink>) {
    const items = [...menu.items];
    items[index] = { ...items[index], ...patch };
    setData({ ...data, [activeTab]: { ...menu, items } });
  }

  function addItem() {
    setData({
      ...data,
      [activeTab]: { ...menu, items: [...menu.items, emptyLink()] },
    });
  }

  function removeItem(index: number) {
    setData({
      ...data,
      [activeTab]: {
        ...menu,
        items: menu.items.filter((_, i) => i !== index),
      },
    });
  }

  async function handleSave() {
    setLoading(true);
    const result = await upsertNavigationMenu(menu);
    setLoading(false);
    if (result.success) {
      toast.success(`${menuLabels[activeTab]} saved`);
      router.refresh();
    } else {
      toast.error(result.error || "Save failed");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex gap-2">
        {(Object.keys(menuLabels) as MenuKey[]).map((key) => (
          <Button
            key={key}
            type="button"
            variant={activeTab === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(key)}
          >
            {menuLabels[key]}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{menuLabels[activeTab]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTab === "header" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ctaLabel">CTA label</Label>
                <Input
                  id="ctaLabel"
                  value={menu.ctaLabel || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      header: { ...data.header, ctaLabel: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaHref">CTA href</Label>
                <Input
                  id="ctaHref"
                  value={menu.ctaHref || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      header: { ...data.header, ctaHref: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
          <div className="space-y-3">
            {menu.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-md border border-slate-100 p-3 sm:flex-row sm:items-start"
              >
                <GripVertical className="mt-2 hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) =>
                        updateItem(index, { label: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Href</Label>
                    <Input
                      value={item.href}
                      onChange={(e) =>
                        updateItem(index, { href: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={item.visible !== false}
                      onCheckedChange={(visible) =>
                        updateItem(index, { visible })
                      }
                    />
                    <Label>Visible</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!!item.openInNewTab}
                      onCheckedChange={(openInNewTab) =>
                        updateItem(index, { openInNewTab })
                      }
                    />
                    <Label>New tab</Label>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add link
          </Button>
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <Button type="button" disabled={loading} onClick={handleSave}>
              {loading ? "Saving…" : "Save menu"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
