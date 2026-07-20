import { PageHeader } from "@/components/admin/PageHeader";
import { SeoSettingsForm } from "@/components/admin/forms/SeoSettingsForm";
import { getSeoSettings } from "@/actions/seo";

export default async function SeoPage() {
  const settings = await getSeoSettings();

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Global search engine optimization settings."
      />
      <SeoSettingsForm
        initial={{
          title: settings.title || "",
          description: settings.description || "",
          keywords: settings.keywords || [],
          titleTemplate: settings.titleTemplate || "",
          robotsIndex: settings.robotsIndex ?? true,
        }}
      />
    </div>
  );
}
