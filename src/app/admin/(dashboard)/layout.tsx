import { requireSession } from "@/lib/auth/session";
import { AdminIntroBypass } from "@/components/admin/AdminIntroBypass";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { AdminProviders } from "@/components/admin/Providers";
import type { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const role = ((session.user as { role?: UserRole }).role ||
    "editor") as UserRole;

  return (
    <AdminIntroBypass>
      <AdminProviders>
        <div data-admin-shell className="flex h-screen bg-slate-50 text-slate-900">
          <Sidebar role={role} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar
              user={{
                name: session.user.name,
                email: session.user.email,
                role,
              }}
            />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </AdminProviders>
    </AdminIntroBypass>
  );
}
