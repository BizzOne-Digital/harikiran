import { notFound } from "next/navigation";
import { getOffering } from "@/actions/offerings";
import { OfferingForm } from "@/components/admin/forms/OfferingForm";

export default async function EditOfferingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offering = await getOffering(id);
  if (!offering) notFound();
  return <OfferingForm id={id} initial={offering} />;
}
