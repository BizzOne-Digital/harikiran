import mongoose, { Schema, models, model } from "mongoose";

export interface IAuditLog {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  previousValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: String,
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: String,
    previousValues: Schema.Types.Mixed,
    newValues: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export const AuditLog =
  models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
