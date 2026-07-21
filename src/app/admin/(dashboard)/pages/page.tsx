import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listPages, deletePage } from "@/actions/pages";
import { CONTENT_STATUSES } from "@/config/site";

export default async function PagesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listPages({
    search: params.search,
    status: params.status,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    title: string;
    slug: string;
    status: string;
    visibility: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Manage site pages and landing content."
        actionHref="/admin/pages/new"
        actionLabel="New page"
      />
      <Suspense>
        <ListToolbar
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          placeholder="Search pages…"
        />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No pages yet"
        emptyDescription="Create your first page to get started."
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (r) => (
              <Link
                href={`/admin/pages/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.title}
              </Link>
            ),
          },
          { key: "slug", header: "Slug", cell: (r) => r.slug },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} />,
          },
          {
            key: "visibility",
            header: "Visible",
            cell: (r) => (r.visibility ? "Yes" : "No"),
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <RowActions
                editHref={`/admin/pages/${r._id}`}
                id={r._id}
                deleteAction={deletePage}
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
