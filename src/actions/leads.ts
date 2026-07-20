"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import { Lead } from "@/models/Lead";
import {
  leadUpdateSchema,
  bulkLeadStatusSchema,
} from "@/lib/validation/admin";
import {
  getActionContext,
  auditAction,
  actionError,
  notDeletedFilter,
  type ActionResult,
} from "@/lib/actions/helpers";
import type { LeadStatus } from "@/types";

export async function listLeads(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("manage_leads");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const filter: Record<string, unknown> = { ...notDeletedFilter() };
  if (params?.status) filter.status = params.status;
  if (params?.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
      { message: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getLead(id: string) {
  await getActionContext("manage_leads");
  await connectDB();
  const item = await Lead.findOne({ _id: id, ...notDeletedFilter() }).lean();
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function updateLead(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_leads");
    const data = leadUpdateSchema.parse(input);
    await connectDB();
    const prev = await Lead.findOne({ _id: id, ...notDeletedFilter() });
    if (!prev) return { success: false, error: "Not found" };

    const update: Record<string, unknown> = {};
    if (data.status) {
      update.status = data.status;
      if (data.status === "contacted") update.lastContactedAt = new Date();
    }
    if (data.priority) update.priority = data.priority;
    if (data.note) {
      update.$push = {
        internalNotes: {
          note: data.note,
          authorId: ctx.userId,
          createdAt: new Date(),
        },
      };
    }

    await Lead.updateOne({ _id: id }, update);
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "update",
      entity: "Lead",
      entityId: id,
      newValues: data as Record<string, unknown>,
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function bulkUpdateLeadStatus(
  input: unknown,
): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_leads");
    const data = bulkLeadStatusSchema.parse(input);
    await connectDB();
    await Lead.updateMany(
      { _id: { $in: data.ids }, ...notDeletedFilter() },
      { status: data.status },
    );
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "bulk_status_change",
      entity: "Lead",
      newValues: { ids: data.ids, status: data.status },
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function markLeadSpam(id: string): Promise<ActionResult> {
  return updateLead(id, { status: "spam" });
}

export async function exportLeadsCsv(params?: {
  status?: string;
}): Promise<ActionResult<{ csv: string }>> {
  try {
    await getActionContext("export_leads");
    await connectDB();
    const filter: Record<string, unknown> = { ...notDeletedFilter() };
    if (params?.status) filter.status = params.status;
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Priority",
      "Service",
      "Source",
      "Created",
    ];
    const rows = leads.map((l) => [
      String(l._id),
      escapeCsv(l.name),
      escapeCsv(l.email),
      escapeCsv(l.phone || ""),
      l.status,
      l.priority,
      escapeCsv(l.serviceInterest || ""),
      escapeCsv(l.leadSource),
      new Date(l.createdAt).toISOString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, data: { csv } };
  } catch (e) {
    return actionError(e);
  }
}

export async function getLeadStatusCounts() {
  await getActionContext("manage_leads");
  await connectDB();
  const statuses: LeadStatus[] = [
    "new",
    "contacted",
    "qualified",
    "follow-up",
    "converted",
    "closed",
    "spam",
  ];
  const counts = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await Lead.countDocuments({ status, ...notDeletedFilter() }),
    })),
  );
  return counts;
}

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const ctx = await getActionContext("manage_leads");
    await connectDB();
    await Lead.updateOne({ _id: id, ...notDeletedFilter() }, { deletedAt: new Date() });
    await auditAction({
      userId: ctx.userId,
      userEmail: ctx.userEmail,
      action: "soft_delete",
      entity: "Lead",
      entityId: id,
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (e) {
    return actionError(e);
  }
}
