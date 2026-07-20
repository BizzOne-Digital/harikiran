"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { SiteSettings } from "@/models/SiteSettings";
import { seoSettingsSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function getSeoSettings() {
  await getActionContext("manage_settings");
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return JSON.parse(
    JSON.stringify(settings?.seo ?? { robotsIndex: true }),
  );
}

export async function updateSeoSettings(input: unknown): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    const data = seoSettingsSchema.parse(input);
    await connectDB();
    await SiteSettings.updateOne({}, { seo: data }, { upsert: true });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "SiteSettings.seo",
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/seo");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
