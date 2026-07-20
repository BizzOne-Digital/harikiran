import { PageHeader } from "@/components/admin/PageHeader";
import { CategoriesClient } from "@/components/admin/CategoriesClient";
import { listCategories } from "@/actions/blog";

export default async function CategoriesPage() {
  const items = await listCategories();

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage blog categories."
      />
      <CategoriesClient items={items} />
    </div>
  );
}
