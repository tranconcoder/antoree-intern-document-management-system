import {
  PREMIUM_TICKET_DOCUMENT_NAME,
  USER_COLLECTION_NAME,
  USER_DOCUMENT_NAME,
} from "@/constants/mongoose.constant";
import { TIME_STAMPS } from "@/constants/schema.constant";
import type { TimeStamps } from "@/types/schema";
import mongoose, { Schema } from "mongoose";

export interface User extends TimeStamps {
  id: string;

  user_email: string;
  user_password: string;

  user_firstName: string;
  user_lastName: string;
  user_gender: boolean;
  user_dayOfBirth: Date;
  user_premiumTicket?: string;
}

export const userSchema = new Schema<User>(
  {
    user_email: { type: String, required: true, unique: true, index: true },
    user_password: { type: String, required: true },

    user_firstName: { type: String, required: true },
    user_lastName: { type: String, required: true },
    user_gender: { type: Boolean, required: true },
    user_dayOfBirth: { type: Date, required: true },
    user_premiumTicket: {
      type: Schema.Types.ObjectId,
      ref: PREMIUM_TICKET_DOCUMENT_NAME,
    },
  },
  {
    timestamps: TIME_STAMPS,
    collection: USER_COLLECTION_NAME,
  }
);

// Static method to get user with populated user_premiumTicket
userSchema.statics.findWithUserPremiumTicket = function (filter = {}) {
  return this.find(filter).populate("user_premiumTicket");
};

export default mongoose.model<User>(USER_DOCUMENT_NAME, userSchema);
