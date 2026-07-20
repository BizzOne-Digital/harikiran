import mongoose, { Schema, models, model } from "mongoose";
import type { MegaMenuGroup, NavLink } from "@/types";

export interface INavigationMenu {
  _id: mongoose.Types.ObjectId;
  key: "header" | "footer" | "mobile";
  label: string;
  items: NavLink[];
  megaMenuGroups: MegaMenuGroup[];
  ctaLabel?: string;
  ctaHref?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NavLinkSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    openInNewTab: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    children: [
      {
        label: String,
        href: String,
        openInNewTab: Boolean,
        visible: Boolean,
      },
    ],
  },
  { _id: false },
);

const NavigationMenuSchema = new Schema<INavigationMenu>(
  {
    key: {
      type: String,
      enum: ["header", "footer", "mobile"],
      required: true,
      unique: true,
    },
    label: { type: String, required: true },
    items: { type: [NavLinkSchema], default: [] },
    megaMenuGroups: [
      {
        title: String,
        links: [NavLinkSchema],
      },
    ],
    ctaLabel: String,
    ctaHref: String,
  },
  { timestamps: true },
);

export const NavigationMenu =
  models.NavigationMenu ||
  model<INavigationMenu>("NavigationMenu", NavigationMenuSchema);
