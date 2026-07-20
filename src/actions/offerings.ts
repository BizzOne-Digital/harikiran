"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { Offering } from "@/models/Offering";
import { offeringSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listOfferings(params?: {
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
    Offering.find(filter)
      .sort({ sortOrder: 1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Offering.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getOffering(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await Offering.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createOffering(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = offeringSchema.parse(input);
    await connectDB();
    const doc = await Offering.create(data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "Offering",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/offerings");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateOffering(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = offeringSchema.parse(input);
    await connectDB();
    const prev = await Offering.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };
    await Offering.updateOne({ _id: id }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "Offering",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/offerings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteOffering(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await Offering.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "Offering",
      entityId: id,
    });
    revalidatePath("/admin/offerings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function toggleOfferingStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("publish_content");
    await connectDB();
    await Offering.updateOne({ _id: id, ...notDeletedFilter() }, { status });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "status_change",
      entity: "Offering",
      entityId: id,
      newValues: { status },
    });
    revalidatePath("/admin/offerings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
