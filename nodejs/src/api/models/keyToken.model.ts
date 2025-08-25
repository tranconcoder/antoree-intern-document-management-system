import mongoose, { Schema } from "mongoose";
import { USER_DOCUMENT_NAME } from "./user.model";
import { TIME_STAMPS } from "@/constants/schema.constant";
import type { TimeStamps } from "@/types/schema";

export const KEY_TOKEN_COLLECTION_NAME = "key_tokens";
export const KEY_TOKEN_DOCUMENT_NAME = "KeyToken";

export interface KeyToken extends TimeStamps {
  userId: string;
  publicKey: string;
  jti: string;
}

const keyTokenSchema = new Schema<KeyToken>(
  {
    userId: { type: String, required: true, ref: USER_DOCUMENT_NAME },
    publicKey: { type: String, required: true },
    jti: { type: String, required: true, unique: true },
  },
  {
    timestamps: TIME_STAMPS,
    collection: KEY_TOKEN_COLLECTION_NAME,
  }
);

keyTokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

export default mongoose.model<KeyToken>(
  KEY_TOKEN_DOCUMENT_NAME,
  keyTokenSchema
);
