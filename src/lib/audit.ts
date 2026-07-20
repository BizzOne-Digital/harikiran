import { connectDB } from "@/lib/db/mongoose";
import { AuditLog } from "@/models/AuditLog";
import type { Types } from "mongoose";

export async function writeAuditLog(params: {
  userId?: Types.ObjectId | string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}) {
  try {
    await connectDB();
    await AuditLog.create({
      userId: params.userId,
      userEmail: params.userEmail,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      previousValues: params.previousValues,
      newValues: params.newValues,
      ip: params.ip,
      userAgent: params.userAgent,
    });
  } catch (error) {
    console.error("[audit] Failed to write audit log:", error);
  }
}
