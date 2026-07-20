"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { MediaAsset } from "@/models/MediaAsset";
import { deleteMedia } from "@/lib/media";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";

export async function listMediaAssets(params?: {
  search?: string;
  folder?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_content");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 24;
  const filter: Record<string, unknown> = { ...notDeletedFilter() };
  if (params?.folder) filter.folder = params.folder;
  if (params?.search) {
    filter.$or = [
      { originalName: { $regex: params.search, $options: "i" } },
      { alt: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MediaAsset.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateMediaAsset(
  id: string,
  input: { alt?: string; caption?: string; tags?: string[] },
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_content");
    await connectDB();
    await MediaAsset.updateOne({ _id: id, ...notDeletedFilter() }, input);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "MediaAsset",
      entityId: id,
      newValues: input,
    });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("delete_collections");
    await connectDB();
    const asset = await MediaAsset.findOne({ _id: id, ...notDeletedFilter() });
    if (!asset) return { success: false, error: "Not found" };
    if (asset.publicId) {
      await deleteMedia(asset.publicId, asset.provider);
    }
    await MediaAsset.updateOne({ _id: id }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "MediaAsset",
      entityId: id,
    });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function saveMediaAssetRecord(data: {
  filename: string;
  originalName: string;
  url: string;
  publicId?: string;
  provider: "cloudinary" | "local";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  folder?: string;
}) {
  await connectDB();
  const doc = await MediaAsset.create({
    ...data,
    tags: [],
    usageRefs: [],
  });
  return String(doc._id);
}
