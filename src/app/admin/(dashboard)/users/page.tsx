import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listUsers, deleteUser } from "@/actions/users";
import { Badge } from "@/components/ui/badge";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listUsers({
    search: params.search,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>;

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage admin users and roles."
        actionHref="/admin/users/new"
        actionLabel="New user"
      />
      <Suspense>
        <ListToolbar placeholder="Search users…" />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No users found"
        emptyDescription="Create admin users to manage the CMS."
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <Link
                href={`/admin/users/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.name}
              </Link>
            ),
          },
          { key: "email", header: "Email", cell: (r) => r.email },
          {
            key: "role",
            header: "Role",
            cell: (r) => (
              <Badge variant="secondary">
                {String(r.role).replace("_", " ")}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-24",
            cell: (r) => (
              <RowActions
                editHref={`/admin/users/${r._id}`}
                id={r._id}
                deleteAction={deleteUser}
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
