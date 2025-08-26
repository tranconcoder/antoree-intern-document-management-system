import {
  DOCUMENT_COLLECTION_NAME,
  DOCUMENT_DOCUMENT_NAME,
} from "@/constants/mongoose.constant";
import { TIME_STAMPS } from "@/constants/schema.constant";
import { FileType, getAllFileTypes } from "@/enums/fileType.enum";
import { model, Schema } from "mongoose";

const documentSchema = new Schema(
  {
    // Metadata
    title: { type: String, required: true, min: 10, max: 200 },
    description: { type: String, required: true, min: 20, max: 1000 },

    // File information
    fileContentType: {
      type: String,
      required: true,
      enum: getAllFileTypes(),
    },
    fileBytes: {
      type: Buffer,
      required: true,
      min: 1024 * 5, // 5 KB
      max: 1024 * 1024 * 10, // 5 MB
    },
    fileSize: { type: Number, required: true },
    fileName: { type: String, required: true, min: 3, max: 100 },

    isPremium: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: TIME_STAMPS,
    collection: DOCUMENT_COLLECTION_NAME,
  }
);

export default model(DOCUMENT_DOCUMENT_NAME, documentSchema);
