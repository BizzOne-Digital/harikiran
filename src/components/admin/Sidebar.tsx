"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Package,
  Newspaper,
  Tags,
  Users,
  HelpCircle,
  MessageSquareQuote,
  Inbox,
  Image,
  Menu,
  FormInput,
  Search,
  Settings,
  UserCog,
  ScrollText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utilities/cn";
import { hasPermission, type Permission } from "@/lib/permissions";
import type { UserRole } from "@/types";
import { useState } from "react";

const navItems: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText, permission: "manage_content" },
  { href: "/admin/services", label: "Services", icon: Briefcase, permission: "manage_content" },
  { href: "/admin/offerings", label: "Offerings", icon: Package, permission: "manage_content" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, permission: "manage_content" },
  { href: "/admin/categories", label: "Categories", icon: Tags, permission: "manage_content" },
  { href: "/admin/team", label: "Team", icon: Users, permission: "manage_content" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, permission: "manage_content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, permission: "manage_content" },
  { href: "/admin/leads", label: "Leads", icon: Inbox, permission: "manage_leads" },
  { href: "/admin/media", label: "Media", icon: Image, permission: "manage_content" },
  { href: "/admin/navigation", label: "Navigation", icon: Menu, permission: "manage_content" },
  { href: "/admin/forms", label: "Forms", icon: FormInput, permission: "manage_settings" },
  { href: "/admin/seo", label: "SEO", icon: Search, permission: "manage_settings" },
  { href: "/admin/settings", label: "Settings", icon: Settings, permission: "manage_settings" },
  { href: "/admin/users", label: "Users", icon: UserCog, permission: "manage_users" },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText, permission: "view_audit_log" },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(role, item.permission),
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-slate-900">TopAdvice4U</p>
            <p className="text-xs text-slate-500">Admin CMS</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
