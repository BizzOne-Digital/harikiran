import mongoose, { Schema, models, model } from "mongoose";
import type { ContentStatus, SeoFields, MediaRef } from "@/types";
import { SeoSchema, MediaRefSchema } from "./SiteSettings";

export interface IBlogCategory {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: String,
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const BlogCategory =
  models.BlogCategory || model<IBlogCategory>("BlogCategory", BlogCategorySchema);

export interface IBlogPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: MediaRef;
  authorName: string;
  authorId?: mongoose.Types.ObjectId;
  categoryIds: mongoose.Types.ObjectId[];
  tags: string[];
  featured: boolean;
  readingTimeMinutes: number;
  status: ContentStatus;
  seo: SeoFields;
  publishedAt?: Date | null;
  scheduledFor?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: MediaRefSchema,
    authorName: { type: String, default: "TopAdvice4U" },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "BlogCategory" }],
    tags: [String],
    featured: { type: Boolean, default: false, index: true },
    readingTimeMinutes: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    seo: { type: SeoSchema, default: {} },
    publishedAt: { type: Date, default: null },
    scheduledFor: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ status: 1, featured: 1 });
BlogPostSchema.index({ tags: 1 });

export const BlogPost =
  models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
