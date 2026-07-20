import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import {
  assertPermission,
  type Permission,
} from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import type { UserRole } from "@/types";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getActionContext(permission?: Permission) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const role = ((session.user as { role?: UserRole }).role ||
    "editor") as UserRole;
  if (permission) {
    assertPermission(role, permission);
  }
  return {
    session,
    role,
    userId: session.user.id,
    userEmail: session.user.email,
  };
}

export async function auditAction(params: {
  userId?: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}) {
  const hdrs = await headers();
  await writeAuditLog({
    ...params,
    ip: hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });
}

export function actionError(error: unknown): ActionResult<never> {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: "Something went wrong." };
}

export function notDeletedFilter() {
  return { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] };
}
