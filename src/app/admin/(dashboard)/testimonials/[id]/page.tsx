import { notFound } from "next/navigation";
import { getTestimonial } from "@/actions/testimonials";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();
  return <TestimonialForm id={id} initial={testimonial} />;
}
