"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { Service } from "@/models/Service";
import { serviceSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listServices(params?: {
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
      { name: { $regex: params.search, $options: "i" } },
      { slug: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    Service.find(filter)
      .sort({ sortOrder: 1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getService(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await Service.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createService(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = serviceSchema.parse(input);
    await connectDB();
    const doc = await Service.create({
      ...data,
      publishedAt: data.status === "published" ? new Date() : null,
    });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "Service",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/services");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateService(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = serviceSchema.parse(input);
    await connectDB();
    const prev = await Service.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };
    const publishedAt =
      data.status === "published" && !prev.publishedAt
        ? new Date()
        : prev.publishedAt;
    await Service.updateOne({ _id: id }, { ...data, publishedAt });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "Service",
      entityId: id,
      previousValues: prev.toObject() as Record<string, unknown>,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${id}`);
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    const prev = await Service.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };
    await Service.updateOne({ _id: id }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "Service",
      entityId: id,
    });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function toggleServiceStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("publish_content");
    await connectDB();
    const update: Record<string, unknown> = { status };
    if (status === "published") update.publishedAt = new Date();
    await Service.updateOne({ _id: id, ...notDeletedFilter() }, update);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "status_change",
      entity: "Service",
      entityId: id,
      newValues: { status },
    });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
