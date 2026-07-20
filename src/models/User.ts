import mongoose, { Schema, models, model } from "mongoose";
import type { UserRole } from "@/types";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor", "lead_manager"],
      default: "editor",
      index: true,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = models.User || model<IUser>("User", UserSchema);
