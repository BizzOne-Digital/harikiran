import { Suspense } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { MediaClient } from "@/components/admin/MediaClient";
import { listMediaAssets } from "@/actions/media";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await listMediaAssets({
    search: params.search,
    page: Number(params.page || 1),
  });

  return (
    <div>
      <PageHeader
        title="Media"
        description="Upload and manage media assets."
      />
      <Suspense>
        <MediaClient
          items={data.items}
          page={data.page}
          totalPages={data.totalPages}
        />
      </Suspense>
    </div>
  );
}
