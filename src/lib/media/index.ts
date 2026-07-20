import { v2 as cloudinary } from "cloudinary";
import { hasCloudinaryConfigured } from "@/lib/env";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
] as const;

export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export interface UploadResult {
  url: string;
  publicId?: string;
  provider: "cloudinary" | "local";
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
  filename: string;
}

export async function uploadMedia(
  file: File,
  folder = "topadvice4u",
): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error("File type not allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds the 8MB size limit.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${nanoid(12)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;

  if (hasCloudinaryConfigured()) {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      bytes: number;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "auto",
            filename_override: filename,
          },
          (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result as typeof result & { secure_url: string });
          },
        )
        .end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      provider: "cloudinary",
      width: result.width,
      height: result.height,
      size: result.bytes,
      mimeType: file.type,
      filename,
    };
  }

  // Local development fallback
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    provider: "local",
    size: file.size,
    mimeType: file.type,
    filename,
  };
}

export async function deleteMedia(publicId: string, provider: string) {
  if (provider === "cloudinary" && hasCloudinaryConfigured() && publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}
