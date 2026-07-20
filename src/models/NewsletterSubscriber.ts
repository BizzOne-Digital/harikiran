import mongoose, { Schema, models, model } from "mongoose";

export interface INewsletterSubscriber {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  status: "active" | "unsubscribed";
  source?: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: String,
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    source: String,
    consent: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export const NewsletterSubscriber =
  models.NewsletterSubscriber ||
  model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberSchema,
  );
