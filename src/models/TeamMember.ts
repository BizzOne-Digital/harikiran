import mongoose, { Schema, models, model } from "mongoose";
import type { ContentStatus, MediaRef } from "@/types";
import { MediaRefSchema } from "./SiteSettings";

export interface ITeamMember {
  _id: mongoose.Types.ObjectId;
  name: string;
  role: string;
  shortBio?: string;
  fullBio?: string;
  photo?: MediaRef;
  email?: string;
  phone?: string;
  linkedin?: string;
  otherLinks?: { label: string; url: string }[];
  designations?: string[];
  sortOrder: number;
  featured: boolean;
  status: ContentStatus;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    shortBio: String,
    fullBio: String,
    photo: MediaRefSchema,
    email: String,
    phone: String,
    linkedin: String,
    otherLinks: [{ label: String, url: String }],
    designations: [String],
    sortOrder: { type: Number, default: 0, index: true },
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

TeamMemberSchema.index({ status: 1, sortOrder: 1 });

export const TeamMember =
  models.TeamMember || model<ITeamMember>("TeamMember", TeamMemberSchema);
