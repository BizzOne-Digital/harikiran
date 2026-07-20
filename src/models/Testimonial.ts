import mongoose, { Schema, models, model } from "mongoose";
import type { MediaRef } from "@/types";
import { MediaRefSchema } from "./SiteSettings";

export interface ITestimonial {
  _id: mongoose.Types.ObjectId;
  clientName: string;
  company?: string;
  testimonial: string;
  image?: MediaRef;
  rating?: number;
  serviceId?: mongoose.Types.ObjectId;
  featured: boolean;
  approved: boolean;
  sortOrder: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true, trim: true },
    company: String,
    testimonial: { type: String, required: true },
    image: MediaRefSchema,
    rating: { type: Number, min: 1, max: 5 },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

TestimonialSchema.index({ approved: 1, featured: 1, sortOrder: 1 });

export const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
