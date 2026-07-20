"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { Testimonial } from "@/models/Testimonial";
import { testimonialSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listTestimonials(params?: {
  search?: string;
  approved?: boolean;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_content");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const filter: Record<string, unknown> = { ...notDeletedFilter() };
  if (params?.approved !== undefined) filter.approved = params.approved;
  if (params?.search) {
    filter.clientName = { $regex: params.search, $options: "i" };
  }
  const [items, total] = await Promise.all([
    Testimonial.find(filter)
      .sort({ sortOrder: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Testimonial.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTestimonial(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await Testimonial.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createTestimonial(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = testimonialSchema.parse(input);
    await connectDB();
    const doc = await Testimonial.create(data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "Testimonial",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/testimonials");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateTestimonial(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = testimonialSchema.parse(input);
    await connectDB();
    await Testimonial.updateOne({ _id: id, ...notDeletedFilter() }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "Testimonial",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await Testimonial.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "Testimonial",
      entityId: id,
    });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function toggleTestimonialApproved(
  id: string,
  approved: boolean,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("publish_content");
    await connectDB();
    await Testimonial.updateOne({ _id: id, ...notDeletedFilter() }, { approved });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "approve_toggle",
      entity: "Testimonial",
      entityId: id,
      newValues: { approved },
    });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
