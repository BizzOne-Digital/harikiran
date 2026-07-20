import mongoose, { Schema, models, model } from "mongoose";

export interface IMediaAsset {
  _id: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  url: string;
  publicId?: string;
  provider: "cloudinary" | "s3" | "local";
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder?: string;
  tags: string[];
  usageRefs: {
    model: string;
    documentId: mongoose.Types.ObjectId;
    field?: string;
  }[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: String,
    provider: {
      type: String,
      enum: ["cloudinary", "s3", "local"],
      default: "cloudinary",
    },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    alt: String,
    caption: String,
    folder: { type: String, default: "general", index: true },
    tags: [String],
    usageRefs: [
      {
        model: String,
        documentId: Schema.Types.ObjectId,
        field: String,
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

MediaAssetSchema.index({ createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });
MediaAssetSchema.index({ originalName: "text", alt: "text", caption: "text" });

export const MediaAsset =
  models.MediaAsset || model<IMediaAsset>("MediaAsset", MediaAssetSchema);
