import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listServices, deleteService } from "@/actions/services";
import { CONTENT_STATUSES } from "@/config/site";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listServices({
    search: params.search,
    status: params.status,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    name: string;
    group: string;
    status: string;
  }>;

  type ServiceRow = (typeof items)[number];

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage advisory service pages."
        actionHref="/admin/services/new"
        actionLabel="New service"
      />
      <Suspense>
        <ListToolbar
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          placeholder="Search services…"
        />
      </Suspense>
      <DataTable<ServiceRow>
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No services yet"
        emptyDescription="Create your first service to get started."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <Link
                href={`/admin/services/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.name}
              </Link>
            ),
          },
          { key: "group", header: "Group", cell: (r) => r.group },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <RowActions
                editHref={`/admin/services/${r._id}`}
                id={r._id}
                deleteAction={deleteService}
              />
            ),
          },
        ]}
      />
      <Suspense fallback={null}>
        <PaginationBar page={data.page} totalPages={data.totalPages} />
      </Suspense>
    </div>
  );
}
