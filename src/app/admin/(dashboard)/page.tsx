import { PageHeader } from "@/components/admin/PageHeader";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { getDashboardStats } from "@/actions/dashboard";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your site content and leads."
      />
      <DashboardCharts stats={stats} />
    </div>
  );
}
