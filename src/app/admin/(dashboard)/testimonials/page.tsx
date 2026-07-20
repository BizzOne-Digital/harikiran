import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { PaginationBar } from "@/components/admin/ListToolbar";
import { listTestimonials, deleteTestimonial } from "@/actions/testimonials";
import { TestimonialsFilters } from "@/components/admin/TestimonialsFilters";
import { Badge } from "@/components/ui/badge";

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; approved?: string; page?: string }>;
}) {
  const params = await searchParams;
  const approved =
    params.approved === "true"
      ? true
      : params.approved === "false"
        ? false
        : undefined;
  const data = await listTestimonials({
    search: params.search,
    approved,
    page: Number(params.page || 1),
  });

  const items = data.items as Array<{
    _id: string;
    clientName: string;
    company?: string;
    rating?: number;
    approved?: boolean;
    featured?: boolean;
  }>;

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials and reviews."
        actionHref="/admin/testimonials/new"
        actionLabel="New testimonial"
      />
      <Suspense>
        <TestimonialsFilters />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No testimonials yet"
        emptyDescription="Add client testimonials to build trust."
        columns={[
          {
            key: "clientName",
            header: "Client",
            cell: (r) => (
              <Link
                href={`/admin/testimonials/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.clientName}
              </Link>
            ),
          },
          { key: "company", header: "Company", cell: (r) => r.company || "—" },
          {
            key: "rating",
            header: "Rating",
            cell: (r) => (r.rating ? `${r.rating}/5` : "—"),
          },
          {
            key: "approved",
            header: "Approved",
            cell: (r) => (
              <Badge variant={r.approved ? "default" : "secondary"}>
                {r.approved ? "Yes" : "No"}
              </Badge>
            ),
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
                editHref={`/admin/testimonials/${r._id}`}
                onDelete={() => deleteTestimonial(r._id)}
              />
            ),
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
