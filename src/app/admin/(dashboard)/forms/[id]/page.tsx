import { notFound } from "next/navigation";
import { getForm } from "@/actions/forms";
import { FormDefinitionForm } from "@/components/admin/forms/FormDefinitionForm";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getForm(id);
  if (!form) notFound();
  return (
    <FormDefinitionForm
      id={id}
      initial={{
        key: form.key,
        name: form.name,
        description: form.description || "",
        notifyEmail: form.notifyEmail || "",
        enabled: form.enabled,
      }}
    />
  );
}
