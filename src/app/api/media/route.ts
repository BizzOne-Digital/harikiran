import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission } from "@/lib/permissions";
import type { UserRole } from "@/types";
import { uploadMedia } from "@/lib/media";
import { saveMediaAssetRecord, listMediaAssets } from "@/actions/media";
import { auditAction } from "@/lib/actions/helpers";

export async function GET(request: NextRequest) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = ((session.user as { role?: UserRole }).role ||
    "editor") as UserRole;
  if (!hasPermission(role, "manage_content")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const data = await listMediaAssets({
    search: searchParams.get("search") || undefined,
    folder: searchParams.get("folder") || undefined,
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 24),
  });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = ((session.user as { role?: UserRole }).role ||
    "editor") as UserRole;
  if (!hasPermission(role, "manage_content")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadMedia(file, folder);
    const id = await saveMediaAssetRecord({
      filename: result.filename,
      originalName: file.name,
      url: result.url,
      publicId: result.publicId,
      provider: result.provider,
      mimeType: result.mimeType,
      size: result.size,
      width: result.width,
      height: result.height,
      folder,
    });

    await auditAction({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "upload",
      entity: "MediaAsset",
      entityId: id,
      newValues: { filename: result.filename, url: result.url },
    });

    return NextResponse.json({
      success: true,
      id,
      url: result.url,
      filename: result.filename,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
