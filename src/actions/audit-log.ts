"use server";

import { connectDB } from "@/lib/db/mongoose";
import { AuditLog } from "@/models/AuditLog";
import { getActionContext } from "@/lib/actions/helpers";

export async function listAuditLogs(params?: {
  search?: string;
  entity?: string;
  page?: number;
  limit?: number;
}) {
  await getActionContext("view_audit_log");
  await connectDB();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 30;
  const filter: Record<string, unknown> = {};
  if (params?.entity) filter.entity = params.entity;
  if (params?.search) {
    filter.$or = [
      { userEmail: { $regex: params.search, $options: "i" } },
      { action: { $regex: params.search, $options: "i" } },
      { entity: { $regex: params.search, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAuditEntities() {
  await getActionContext("view_audit_log");
  await connectDB();
  return AuditLog.distinct("entity");
}
