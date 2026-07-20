import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RowActions } from "@/components/admin/RowActions";
import { ListToolbar, PaginationBar } from "@/components/admin/ListToolbar";
import { listFaqs, deleteFaq, getFaqCategories } from "@/actions/faqs";
import { CONTENT_STATUSES } from "@/config/site";
import { FaqFilters } from "@/components/admin/FaqFilters";

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const [data, categories] = await Promise.all([
    listFaqs({
      search: params.search,
      status: params.status,
      category: params.category,
      page: Number(params.page || 1),
    }),
    getFaqCategories(),
  ]);

  const items = data.items as Array<{
    _id: string;
    question: string;
    category: string;
    status: string;
  }>;

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions."
        actionHref="/admin/faqs/new"
        actionLabel="New FAQ"
      />
      <Suspense>
        <FaqFilters
          categories={categories}
          statusOptions={CONTENT_STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
        />
      </Suspense>
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No FAQs yet"
        emptyDescription="Add FAQs to help visitors find answers."
        columns={[
          {
            key: "question",
            header: "Question",
            cell: (r) => (
              <Link
                href={`/admin/faqs/${r._id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {r.question}
              </Link>
            ),
          },
          { key: "category", header: "Category", cell: (r) => r.category },
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
                editHref={`/admin/faqs/${r._id}`}
                onDelete={() => deleteFaq(r._id)}
              />
            ),
          },
        ]}
      />
      <PaginationBar page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
