import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listOfferings, deleteOffering } from "@/actions/offerings";
import { CONTENT_STATUSES } from "@/config/site";

export default async function OfferingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listOfferings({
    search: params.search,
    status: params.status,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    name: string;
    type: string;
    status: string;
    featured?: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Offerings"
        description="Manage services, plans, and programs."
        actionHref="/admin/offerings/new"
        actionLabel="New offering"
      />
      <Suspense>
        <ListToolbar
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          placeholder="Search offerings…"
        />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No offerings yet"
        emptyDescription="Create your first offering to get started."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <Link
                href={`/admin/offerings/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.name}
              </Link>
            ),
          },
          { key: "type", header: "Type", cell: (r) => r.type },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "featured",
            header: "Featured",
            cell: (r) => (r.featured ? "Yes" : "No"),
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <RowActions
                editHref={`/admin/offerings/${r._id}`}
                onDelete={() => deleteOffering(r._id)}
              />
            ),
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
