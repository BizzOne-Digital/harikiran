import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listBlogPosts, deleteBlogPost } from "@/actions/blog";
import { CONTENT_STATUSES } from "@/config/site";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listBlogPosts({
    search: params.search,
    status: params.status,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    title: string;
    authorName?: string;
    status: string;
    featured?: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Manage blog posts and articles."
        actionHref="/admin/blog/new"
        actionLabel="New post"
      />
      <Suspense>
        <ListToolbar
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          placeholder="Search posts…"
        />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No posts yet"
        emptyDescription="Create your first blog post to get started."
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (r) => (
              <Link
                href={`/admin/blog/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.title}
              </Link>
            ),
          },
          {
            key: "author",
            header: "Author",
            cell: (r) => r.authorName || "—",
          },
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
                editHref={`/admin/blog/${r._id}`}
                onDelete={() => deleteBlogPost(r._id)}
              />
            ),
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
