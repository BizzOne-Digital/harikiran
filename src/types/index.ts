import { Types } from "mongoose";

export type ObjectIdString = string;

export interface SoftDelete {
  deletedAt?: Date | null;
}

export type ContentStatus = "draft" | "published" | "archived";

export type UserRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "lead_manager";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "follow-up"
  | "converted"
  | "closed"
  | "spam";

export type LeadPriority = "low" | "normal" | "high";

export type ClientType = "individual" | "business";

export type PreferredContact = "email" | "phone" | "either";

export type OfferingType = "service" | "plan" | "program" | "product";

export type ServiceGroup = "protection" | "financing" | "future-legacy";

export type ServiceAudienceFilter =
  | "family"
  | "property"
  | "business"
  | "legacy";

export interface SeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface MediaRef {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  publicId?: string;
  assetId?: Types.ObjectId | string;
}

export interface NavLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
  visible?: boolean;
  children?: NavLink[];
}

export interface MegaMenuGroup {
  title: string;
  links: NavLink[];
}

export interface PageSection {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  data: Record<string, unknown>;
}
