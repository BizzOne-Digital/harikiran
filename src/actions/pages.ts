"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { Page } from "@/models/Page";
import { pageSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listPages(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_content");
  await connectDB();
  const pageNum = params?.page ?? 1;
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
    Page.find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * limit)
      .limit(limit)
      .lean(),
    Page.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPage(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await Page.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createPage(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = pageSchema.parse(input);
    await connectDB();
    const doc = await Page.create({
      ...data,
      sections: [],
      publishedAt: data.status === "published" ? new Date() : null,
    });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "Page",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/pages");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updatePage(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = pageSchema.parse(input);
    await connectDB();
    const prev = await Page.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };
    const publishedAt =
      data.status === "published" && !prev.publishedAt
        ? new Date()
        : prev.publishedAt;
    await Page.updateOne({ _id: id }, { ...data, publishedAt });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "Page",
      entityId: id,
      previousValues: {
        title: prev.title,
        status: prev.status,
      },
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/pages");
    revalidatePath(`/${prev.slug === "home" ? "" : prev.slug}`);
    if (data.slug && data.slug !== prev.slug) {
      revalidatePath(`/${data.slug}`);
    }
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deletePage(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await Page.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "Page",
      entityId: id,
    });
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function togglePageStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("publish_content");
    await connectDB();
    const update: Record<string, unknown> = { status };
    if (status === "published") update.publishedAt = new Date();
    await Page.updateOne({ _id: id, ...notDeletedFilter() }, update);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "status_change",
      entity: "Page",
      entityId: id,
      newValues: { status },
    });
    revalidatePath("/admin/pages");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
