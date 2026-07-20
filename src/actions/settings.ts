"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { SiteSettings } from "@/models/SiteSettings";
import { siteSettingsSchema } from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  type ActionResult,
} from "@/lib/actions/helpers";
import { SITE_DEFAULTS } from "@/config/site";

export async function getSettings() {
  await getActionContext("manage_settings");
  await connectDB();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({
      businessName: SITE_DEFAULTS.businessName,
      shortName: SITE_DEFAULTS.shortName,
      description: SITE_DEFAULTS.description,
      tagline: SITE_DEFAULTS.tagline,
      email: SITE_DEFAULTS.email,
      phone: SITE_DEFAULTS.phone,
    }).then((d) => d.toObject());
  }
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSettings(input: unknown): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    const data = siteSettingsSchema.parse(input);
    await connectDB();
    const existing = await SiteSettings.findOne();
    if (existing) {
      await SiteSettings.updateOne({ _id: existing._id }, data);
    } else {
      await SiteSettings.create(data);
    }
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "SiteSettings",
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateHomepageFlags(
  input: Record<string, boolean>,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    await connectDB();
    await SiteSettings.updateOne(
      {},
      { homepage: input },
      { upsert: true },
    );
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "SiteSettings.homepage",
      newValues: input,
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateFooterSettings(
  input: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_settings");
    await connectDB();
    await SiteSettings.updateOne({}, { footer: input }, { upsert: true });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "SiteSettings.footer",
      newValues: input,
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function updateIntegrations(
  input: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_integrations");
    await connectDB();
    await SiteSettings.updateOne({}, { integrations: input }, { upsert: true });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "SiteSettings.integrations",
      newValues: input,
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
