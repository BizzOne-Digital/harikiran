"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { BlogPost, BlogCategory } from "@/models/Blog";
import { blogPostSchema, blogCategorySchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listBlogPosts(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_content");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const filter: Record<string, unknown> = { ...notDeletedFilter() };
  if (params?.status) filter.status = params.status;
  if (params?.search) {
    filter.$or = [
      { title: { $regex: params.search, $options: "i" } },
      { slug: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBlogPost(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await BlogPost.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createBlogPost(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = blogPostSchema.parse(input);
    await connectDB();
    const doc = await BlogPost.create({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "BlogPost",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/blog");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateBlogPost(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = blogPostSchema.parse(input);
    await connectDB();
    const prev = await BlogPost.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };
    const publishedAt =
      data.status === "published" && !prev.publishedAt
        ? new Date()
        : prev.publishedAt;
    await BlogPost.updateOne({ _id: id }, { ...data, publishedAt });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "BlogPost",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await BlogPost.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "BlogPost",
      entityId: id,
    });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function toggleBlogPostStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("publish_content");
    await connectDB();
    const update: Record<string, unknown> = { status };
    if (status === "published") update.publishedAt = new Date();
    await BlogPost.updateOne({ _id: id, ...notDeletedFilter() }, update);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "status_change",
      entity: "BlogPost",
      entityId: id,
      newValues: { status },
    });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function listCategories() {
  await getActionContext("manage_content");
  await connectDB();
  const items = await BlogCategory.find().sort({ sortOrder: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function createCategory(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = blogCategorySchema.parse(input);
    await connectDB();
    const doc = await BlogCategory.create(data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "BlogCategory",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/categories");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateCategory(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = blogCategorySchema.parse(input);
    await connectDB();
    await BlogCategory.updateOne({ _id: id }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "BlogCategory",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await BlogCategory.deleteOne({ _id: id });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "delete",
      entity: "BlogCategory",
      entityId: id,
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
