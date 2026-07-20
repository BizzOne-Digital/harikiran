"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation/admin";
import { getAuth } from "@/lib/auth/auth";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_users");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const filter: Record<string, unknown> = { ...notDeletedFilter() };
  if (params?.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUser(id: string) {
  await getActionContext("manage_users");
  await connectDB();
  const item = await User.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function createUser(input: unknown): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_users");
    const data = userCreateSchema.parse(input);
    await getAuth().api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
    await connectDB();
    await User.updateOne({ email: data.email }, { role: data.role });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "create",
      entity: "User",
      newValues: { email: data.email, role: data.role },
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateUser(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_users");
    const data = userUpdateSchema.parse(input);
    await connectDB();
    await User.updateOne({ _id: id, ...notDeletedFilter() }, data);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "User",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_users");
    if (ctx.userId === id) {
      return { success: false, error: "You cannot delete your own account." };
    }
    await connectDB();
    await User.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "User",
      entityId: id,
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
