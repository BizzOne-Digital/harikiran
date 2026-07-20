import { notFound } from "next/navigation";
import { getService } from "@/actions/services";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();
  return <ServiceForm id={id} initial={service} />;
}
