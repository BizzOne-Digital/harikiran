import mongoose, { Schema, models, model } from "mongoose";
import type { ContentStatus, PageSection, SeoFields } from "@/types";
import { SeoSchema } from "./SiteSettings";

export interface IPageImage {
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

export interface IPage {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  status: ContentStatus;
  seo: SeoFields;
  hero?: {
    heading?: string;
    subheading?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    themeVariant?: string;
    eyebrow?: string;
  };
  bodyHtml?: string;
  images: IPageImage[];
  sections: PageSection[];
  themeVariant?: string;
  visibility: boolean;
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PageImageSchema = new Schema<IPageImage>(
  {
    url: { type: String, required: true },
    alt: String,
    caption: String,
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const PageSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const PageSchema = new Schema<IPage>(
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
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    seo: { type: SeoSchema, default: {} },
    hero: {
      heading: String,
      subheading: String,
      primaryCtaLabel: String,
      primaryCtaHref: String,
      secondaryCtaLabel: String,
      secondaryCtaHref: String,
      backgroundImage: String,
      backgroundVideo: String,
      themeVariant: String,
      eyebrow: String,
    },
    bodyHtml: { type: String, default: "" },
    images: { type: [PageImageSchema], default: [] },
    sections: { type: [PageSectionSchema], default: [] },
    themeVariant: String,
    visibility: { type: Boolean, default: true },
    publishedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

PageSchema.index({ status: 1, slug: 1 });

export const Page = models.Page || model<IPage>("Page", PageSchema);
