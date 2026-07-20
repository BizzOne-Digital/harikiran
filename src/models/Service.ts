import mongoose, { Schema, models, model } from "mongoose";
import type {
  ContentStatus,
  SeoFields,
  ServiceGroup,
  ServiceAudienceFilter,
  MediaRef,
} from "@/types";
import { SeoSchema, MediaRefSchema } from "./SiteSettings";

export interface IService {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  summary: string;
  content: string;
  icon?: string;
  image?: MediaRef;
  group: ServiceGroup;
  audienceFilters: ServiceAudienceFilter[];
  targetAudience: string[];
  challenges: string[];
  benefits: string[];
  processSteps: { title: string; description: string }[];
  relatedServiceIds: mongoose.Types.ObjectId[];
  relatedFaqIds: mongoose.Types.ObjectId[];
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
  sortOrder: number;
  status: ContentStatus;
  seo: SeoFields;
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
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
    shortDescription: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, default: "" },
    icon: String,
    image: MediaRefSchema,
    group: {
      type: String,
      enum: ["protection", "financing", "future-legacy"],
      required: true,
      index: true,
    },
    audienceFilters: [
      {
        type: String,
        enum: ["family", "property", "business", "legacy"],
      },
    ],
    targetAudience: [String],
    challenges: [String],
    benefits: [String],
    processSteps: [
      {
        title: String,
        description: String,
        _id: false,
      },
    ],
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    relatedFaqIds: [{ type: Schema.Types.ObjectId, ref: "FAQ" }],
    ctaLabel: { type: String, default: "Book a Free Consultation" },
    ctaHref: { type: String, default: "/contact" },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    seo: { type: SeoSchema, default: {} },
    publishedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

ServiceSchema.index({ status: 1, sortOrder: 1 });
ServiceSchema.index({ status: 1, group: 1 });
ServiceSchema.index({ status: 1, featured: 1 });

export const Service = models.Service || model<IService>("Service", ServiceSchema);
