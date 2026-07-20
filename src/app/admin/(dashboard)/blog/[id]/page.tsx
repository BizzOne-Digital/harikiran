import { notFound } from "next/navigation";
import { getBlogPost } from "@/actions/blog";
import { BlogPostForm } from "@/components/admin/forms/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();
  return <BlogPostForm id={id} initial={post} />;
}
