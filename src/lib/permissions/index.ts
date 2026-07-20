import type { UserRole } from "@/types";

export type Permission =
  | "manage_users"
  | "manage_content"
  | "publish_content"
  | "manage_leads"
  | "export_leads"
  | "manage_settings"
  | "view_audit_log"
  | "manage_security"
  | "delete_collections"
  | "manage_integrations";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "manage_users",
    "manage_content",
    "publish_content",
    "manage_leads",
    "export_leads",
    "manage_settings",
    "view_audit_log",
    "manage_security",
    "delete_collections",
    "manage_integrations",
  ],
  admin: [
    "manage_content",
    "publish_content",
    "manage_leads",
    "export_leads",
    "manage_settings",
    "view_audit_log",
  ],
  editor: ["manage_content", "publish_content"],
  lead_manager: ["manage_leads", "export_leads"],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertPermission(role: UserRole, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error("Unauthorized");
  }
}
