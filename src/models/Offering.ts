import mongoose, { Schema, models, model } from "mongoose";
import type { ContentStatus, OfferingType, SeoFields, MediaRef } from "@/types";
import { SeoSchema, MediaRefSchema } from "./SiteSettings";

export interface IOffering {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: OfferingType;
  shortDescription: string;
  fullDescription: string;
  image?: MediaRef;
  icon?: string;
  priceDisplay?: string;
  contactForDetails: boolean;
  features: string[];
  eligibilityNotes?: string;
  ctaLabel: string;
  ctaUrl: string;
  featured: boolean;
  sortOrder: number;
  status: ContentStatus;
  seo: SeoFields;
  relatedServiceId?: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const OfferingSchema = new Schema<IOffering>(
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
    type: {
      type: String,
      enum: ["service", "plan", "program", "product"],
      default: "plan",
      index: true,
    },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    image: MediaRefSchema,
    icon: String,
    priceDisplay: String,
    contactForDetails: { type: Boolean, default: true },
    features: [String],
    eligibilityNotes: String,
    ctaLabel: { type: String, default: "Contact for Details" },
    ctaUrl: { type: String, default: "/contact" },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    seo: { type: SeoSchema, default: {} },
    relatedServiceId: { type: Schema.Types.ObjectId, ref: "Service" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

OfferingSchema.index({ status: 1, sortOrder: 1 });

export const Offering =
  models.Offering || model<IOffering>("Offering", OfferingSchema);
