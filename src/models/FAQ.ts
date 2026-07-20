import mongoose, { Schema, models, model } from "mongoose";
import type { ContentStatus } from "@/types";

export interface IFAQ {
  _id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  category: string;
  relatedServiceIds: mongoose.Types.ObjectId[];
  sortOrder: number;
  featured: boolean;
  status: ContentStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

FAQSchema.index({ status: 1, category: 1, sortOrder: 1 });

export const FAQ = models.FAQ || model<IFAQ>("FAQ", FAQSchema);
