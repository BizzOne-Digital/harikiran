import { notFound } from "next/navigation";
import { getFaq, getFaqCategories } from "@/actions/faqs";
import { FaqForm } from "@/components/admin/forms/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([
    getFaq(id),
    getFaqCategories(),
  ]);
  if (!faq) notFound();
  return <FaqForm id={id} initial={faq} categories={categories} />;
}
