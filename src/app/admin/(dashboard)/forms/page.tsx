import { PageHeader } from "@/components/admin/PageHeader";
import { FormsListClient } from "@/components/admin/FormsListClient";
import { listForms } from "@/actions/forms";

export default async function FormsPage() {
  const items = await listForms();

  return (
    <div>
      <PageHeader
        title="Forms"
        description="Manage form definitions and notifications."
        actionHref="/admin/forms/new"
        actionLabel="New form"
      />
      <FormsListClient items={items} />
    </div>
  );
}
