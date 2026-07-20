import { PageHeader } from "@/components/admin/PageHeader";
import { NavigationEditor } from "@/components/admin/forms/NavigationEditor";
import { getNavigationMenu } from "@/actions/navigation";

export default async function NavigationPage() {
  const [header, footer, mobile] = await Promise.all([
    getNavigationMenu("header"),
    getNavigationMenu("footer"),
    getNavigationMenu("mobile"),
  ]);

  return (
    <div>
      <PageHeader
        title="Navigation"
        description="Edit header, footer, and mobile menus."
      />
      <NavigationEditor
        menus={{
          header: header || undefined,
          footer: footer || undefined,
          mobile: mobile || undefined,
        }}
      />
    </div>
  );
}
