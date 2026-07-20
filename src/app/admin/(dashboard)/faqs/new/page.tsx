import { getFaqCategories } from "@/actions/faqs";
import { FaqForm } from "@/components/admin/forms/FaqForm";

export default async function NewFaqPage() {
  const categories = await getFaqCategories();
  return <FaqForm categories={categories} />;
}
