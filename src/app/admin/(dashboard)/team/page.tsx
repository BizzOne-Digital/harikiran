import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listTeamMembers, deleteTeamMember } from "@/actions/team";
import { CONTENT_STATUSES } from "@/config/site";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listTeamMembers({
    search: params.search,
    status: params.status,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    name: string;
    role: string;
    status: string;
    featured?: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Team"
        description="Manage team member profiles."
        actionHref="/admin/team/new"
        actionLabel="New member"
      />
      <Suspense>
        <ListToolbar
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          placeholder="Search team…"
        />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No team members yet"
        emptyDescription="Add team members to display on the site."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <Link
                href={`/admin/team/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.name}
              </Link>
            ),
          },
          { key: "role", header: "Role", cell: (r) => r.role },
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
                editHref={`/admin/team/${r._id}`}
                onDelete={() => deleteTeamMember(r._id)}
              />
            ),
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
