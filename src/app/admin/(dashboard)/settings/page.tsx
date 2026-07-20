import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { getSettings } from "@/actions/settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Business information and site configuration."
      />
      <SettingsForm
        initial={{
          businessName: settings.businessName,
          shortName: settings.shortName,
          description: settings.description,
          tagline: settings.tagline || "",
          email: settings.email,
          phone: settings.phone,
          address: settings.address || "",
          businessHours: settings.businessHours || "",
          consultationUrl: settings.consultationUrl || "",
        }}
      />
    </div>
  );
}
