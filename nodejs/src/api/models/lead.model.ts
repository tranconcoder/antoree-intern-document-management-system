import {
  LEAD_DOCUMENT_NAME,
  LEAD_COLLECTION_NAME,
} from "@/constants/mongoose.constant";
import { TIME_STAMPS } from "@/constants/schema.constant";
import type { TimeStamps } from "@/types/schema";
import mongoose, { Schema } from "mongoose";

export interface Lead extends TimeStamps {
  id: string;

  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  lead_company?: string;
  lead_message?: string;
  lead_status: "new" | "contacted" | "qualified" | "converted" | "lost";
  lead_tags?: string[];
  lead_metadata?: Record<string, any>;
}

export const leadSchema = new Schema<Lead>(
  {
    lead_name: { type: String, required: true },
    lead_email: { type: String, required: true },
    lead_phone: { type: String },
    lead_company: { type: String },
    lead_message: { type: String },
    lead_status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
    lead_tags: [{ type: String }],
    lead_metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: TIME_STAMPS,
    collection: LEAD_COLLECTION_NAME,
  }
);

// Index for better query performance
leadSchema.index({ lead_email: 1 });
leadSchema.index({ lead_status: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model<Lead>(LEAD_DOCUMENT_NAME, leadSchema);
