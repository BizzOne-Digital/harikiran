import { PageHeader } from "@/components/admin/PageHeader";
import { LeadsClient } from "@/components/admin/LeadsClient";
import { listLeads, getLeadStatusCounts } from "@/actions/leads";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [data, statusCounts] = await Promise.all([
    listLeads({
      search: params.search,
      status: params.status,
      page: Number(params.page || 1),
    }),
    getLeadStatusCounts(),
  ]);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Review and manage inbound leads."
      />
      <LeadsClient
        items={data.items}
        page={data.page}
        totalPages={data.totalPages}
        statusCounts={statusCounts}
      />
    </div>
  );
}
