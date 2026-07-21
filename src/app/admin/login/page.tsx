import { Suspense } from "react";
import { AdminIntroBypass } from "@/components/admin/AdminIntroBypass";
import { AdminProviders } from "@/components/admin/Providers";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <AdminIntroBypass>
      <AdminProviders>
        <div
          data-admin-shell
          className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900"
        >
          <Suspense
            fallback={
              <div className="rounded-xl border border-slate-200 bg-white px-8 py-6 text-sm text-slate-600 shadow">
                Loading sign in…
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </AdminProviders>
    </AdminIntroBypass>
  );
}
