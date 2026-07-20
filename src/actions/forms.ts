"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { FormDefinition } from "@/models/FormDefinition";
import { formDefinitionSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listForms() {
  await getActionContext("manage_settings");
  await connectDB();
  const items = await FormDefinition.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getForm(id: string) {
  await getActionContext("manage_settings");
  await connectDB();
  const item = await FormDefinition.findById(id).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function upsertForm(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const ctx = await getActionContext("manage_settings");
    const data = formDefinitionSchema.parse(input);
    await connectDB();
    const doc = await FormDefinition.findOneAndUpdate(
      { key: data.key },
      { ...data, fields: [] },
      { upsert: true, new: true },
    );
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "upsert",
      entity: "FormDefinition",
      entityId: String(doc._id),
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/forms");
    return { success: true, data: { id: String(doc._id) } };
  } catch (e) {
    return actionError(e);
  }
}

export async function toggleFormEnabled(
  id: string,
  enabled: boolean,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    await connectDB();
    await FormDefinition.updateOne({ _id: id }, { enabled });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "toggle",
      entity: "FormDefinition",
      entityId: id,
      newValues: { enabled },
    });
    revalidatePath("/admin/forms");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteForm(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    await connectDB();
    await FormDefinition.deleteOne({ _id: id });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "delete",
      entity: "FormDefinition",
      entityId: id,
    });
    revalidatePath("/admin/forms");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
