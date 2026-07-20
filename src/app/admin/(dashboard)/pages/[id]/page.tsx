import { notFound } from "next/navigation";
import { getPage } from "@/actions/pages";
import { PageForm } from "@/components/admin/forms/PageForm";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();
  return <PageForm id={id} initial={page} />;
}
