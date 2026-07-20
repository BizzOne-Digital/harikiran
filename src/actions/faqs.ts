"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { FAQ } from "@/models/FAQ";
import { faqSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listFaqs(params?: {
  search?: string;
  category?: string;
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
  if (params?.category) filter.category = params.category;
  if (params?.search) {
    filter.$or = [
      { question: { $regex: params.search, $options: "i" } },
      { answer: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    FAQ.find(filter)
      .sort({ sortOrder: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    FAQ.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getFaq(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await FAQ.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createFaq(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = faqSchema.parse(input);
    await connectDB();
    const doc = await FAQ.create(data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "FAQ",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/faqs");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateFaq(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = faqSchema.parse(input);
    await connectDB();
    await FAQ.updateOne({ _id: id, ...notDeletedFilter() }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "FAQ",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await FAQ.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "FAQ",
      entityId: id,
    });
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function getFaqCategories() {
  await getActionContext("manage_content");
  await connectDB();
  const cats = await FAQ.distinct("category", notDeletedFilter());
  return cats as string[];
}
