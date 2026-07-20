"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { NavigationMenu } from "@/models/NavigationMenu";
import { navigationSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listNavigationMenus() {
  await getActionContext("manage_content");
  await connectDB();
  const items = await NavigationMenu.find().lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getNavigationMenu(key: string) {
  await getActionContext("manage_content");
  await connectDB();
  const item = await NavigationMenu.findOne({ key }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function upsertNavigationMenu(
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    const data = navigationSchema.parse(input);
    await connectDB();
    await NavigationMenu.findOneAndUpdate(
      { key: data.key },
      data,
      { upsert: true, new: true },
    );
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "upsert",
      entity: "NavigationMenu",
      entityId: data.key,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/navigation");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
