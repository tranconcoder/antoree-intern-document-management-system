import type { TimeStamps } from "@/types/schema";
import mongoose, { Schema } from "mongoose";
import { USER_DOCUMENT_NAME } from "./user.model";
import {
  PremiumTicketStatus,
  PremiumTicketTime,
  PREMIUM_TICKET_STATUSES,
  PREMIUM_TICKET_TIMES,
} from "../enums/premiumTicket.enum";

export const PREMIUM_TICKET_COLLECTION_NAME = "premium_tickets";
export const PREMIUM_TICKET_DOCUMENT_NAME = "PremiumTicket";

export interface PremiumTicket extends TimeStamps {
  id: string;
  ticket_userId: Schema.Types.ObjectId;
  ticket_time: PremiumTicketTime;
  ticket_transactionId?: string;
  ticket_status: PremiumTicketStatus;
}

export const premiumTicketSchema = new Schema<PremiumTicket>(
  {
    ticket_userId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
    },

    ticket_time: {
      type: String,
      enum: PREMIUM_TICKET_TIMES,
      required: true,
    },

    ticket_transactionId: { type: String, index: true, unique: false },

    ticket_status: {
      type: String,
      enum: PREMIUM_TICKET_STATUSES,
      default: PremiumTicketStatus.Pending,
    },
  },
  {
    timestamps: true,
    collection: PREMIUM_TICKET_COLLECTION_NAME,
  }
);

export default mongoose.model<PremiumTicket>(
  PREMIUM_TICKET_DOCUMENT_NAME,
  premiumTicketSchema
);
