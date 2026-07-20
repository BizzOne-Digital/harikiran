import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { PaginationBar, formatDate } from "@/components/admin/ListToolbar";
import { AuditLogFilters } from "@/components/admin/AuditLogFilters";
import { listAuditLogs, getAuditEntities } from "@/actions/audit-log";
import { Badge } from "@/components/ui/badge";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; entity?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [data, entities] = await Promise.all([
    listAuditLogs({
      search: params.search,
      entity: params.entity,
      page: Number(params.page || 1),
    }),
    getAuditEntities(),
  ]);

  const items = data.items as Array<{
    _id: string;
    createdAt: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
  }>;

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Read-only history of admin actions."
      />
      <Suspense>
        <AuditLogFilters entities={entities} />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No audit entries"
        emptyDescription="Admin actions will be logged here."
        columns={[
          {
            key: "createdAt",
            header: "When",
            cell: (r) => formatDate(r.createdAt),
          },
          {
            key: "userEmail",
            header: "User",
            cell: (r) => r.userEmail || "—",
          },
          {
            key: "action",
            header: "Action",
            cell: (r) => (
              <Badge variant="outline">{r.action}</Badge>
            ),
          },
          { key: "entity", header: "Entity", cell: (r) => r.entity },
          {
            key: "entityId",
            header: "Entity ID",
            cell: (r) => r.entityId || "—",
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
