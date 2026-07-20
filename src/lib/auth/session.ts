import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "./auth";
import type { UserRole } from "@/types";

export async function getSession() {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(allowed: UserRole[]) {
  const session = await requireSession();
  const role = (session.user as { role?: UserRole }).role || "editor";
  if (!allowed.includes(role)) {
    redirect("/admin");
  }
  return { session, role };
}
