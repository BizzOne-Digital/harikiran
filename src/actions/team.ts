"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { TeamMember } from "@/models/TeamMember";
import { teamMemberSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listTeamMembers(params?: {
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
    filter.name = { $regex: params.search, $options: "i" };
  }
  const [items, total] = await Promise.all([
    TeamMember.find(filter)
      .sort({ sortOrder: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    TeamMember.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTeamMember(id: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await TeamMember.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createTeamMember(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = teamMemberSchema.parse(input);
    await connectDB();
    const doc = await TeamMember.create(data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "TeamMember",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/team");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateTeamMember(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = teamMemberSchema.parse(input);
    await connectDB();
    await TeamMember.updateOne({ _id: id, ...notDeletedFilter() }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "TeamMember",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    await TeamMember.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "TeamMember",
      entityId: id,
    });
    revalidatePath("/admin/team");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
