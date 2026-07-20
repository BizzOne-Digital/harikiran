import mongoose, { Schema, models, model } from "mongoose";

export interface IFormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  order: number;
}

export interface IFormDefinition {
  _id: mongoose.Types.ObjectId;
  key: string;
  name: string;
  description?: string;
  fields: IFormField[];
  successMessage: string;
  notifyEmail?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: [String],
    placeholder: String,
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const FormDefinitionSchema = new Schema<IFormDefinition>(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: String,
    fields: { type: [FormFieldSchema], default: [] },
    successMessage: {
      type: String,
      default: "Thank you. We will be in touch shortly.",
    },
    notifyEmail: String,
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const FormDefinition =
  models.FormDefinition ||
  model<IFormDefinition>("FormDefinition", FormDefinitionSchema);
