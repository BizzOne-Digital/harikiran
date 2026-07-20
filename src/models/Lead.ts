import mongoose, { Schema, models, model } from "mongoose";
import type {
  LeadStatus,
  LeadPriority,
  ClientType,
  PreferredContact,
} from "@/types";

export interface ILead {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  clientType: ClientType;
  company?: string;
  serviceInterest?: string;
  serviceId?: mongoose.Types.ObjectId;
  message?: string;
  timeline?: string;
  preferredContact: PreferredContact;
  leadSource: string;
  landingPage?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  consent: boolean;
  formType: "consultation" | "contact" | "service" | "newsletter" | "calculator";
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo?: mongoose.Types.ObjectId;
  internalNotes: { note: string; authorId?: mongoose.Types.ObjectId; createdAt: Date }[];
  lastContactedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: String,
    clientType: {
      type: String,
      enum: ["individual", "business"],
      default: "individual",
    },
    company: String,
    serviceInterest: String,
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    message: String,
    timeline: String,
    preferredContact: {
      type: String,
      enum: ["email", "phone", "either"],
      default: "either",
    },
    leadSource: { type: String, default: "website", index: true },
    landingPage: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String,
    },
    consent: { type: Boolean, required: true },
    formType: {
      type: String,
      enum: ["consultation", "contact", "service", "newsletter", "calculator"],
      default: "consultation",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "follow-up",
        "converted",
        "closed",
        "spam",
      ],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    internalNotes: [
      {
        note: String,
        authorId: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastContactedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ serviceInterest: 1, status: 1 });
LeadSchema.index({ name: "text", email: "text", message: "text" });

export const Lead = models.Lead || model<ILead>("Lead", LeadSchema);
