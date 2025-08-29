import {
  DOCUMENT_COLLECTION_NAME,
  DOCUMENT_DOCUMENT_NAME,
} from "@/constants/mongoose.constant";
import { TIME_STAMPS } from "@/constants/schema.constant";
import { getAllFileTypes } from "@/enums/fileType.enum";
import type { TimeStamps } from "@/types/schema";
import mongoose, { model, Schema } from "mongoose";

export interface Document extends TimeStamps {
  title: string;
  description: string;
  previewAvatar: Buffer;

  userId: mongoose.Schema.Types.ObjectId;

  files: Array<{
    data: Buffer;
    contentType: string;
    fileSize: number;
    fileName: string;
  }>;

  isPremium: boolean;
  isPublic: boolean;
}

const documentSchema = new Schema<Document>(
  {
    // Metadata - with explicit UTF-8 support
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
      validate: {
        validator: function (v: string) {
          // Ensure UTF-8 encoding is valid
          return Buffer.byteLength(v, "utf8") <= 600; // Allow for 3x max chars in UTF-8
        },
        message:
          "Title contains invalid characters or is too long when encoded",
      },
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1000,
      validate: {
        validator: function (v: string) {
          return Buffer.byteLength(v, "utf8") <= 3000; // Allow for 3x max chars in UTF-8
        },
        message:
          "Description contains invalid characters or is too long when encoded",
      },
    },
    previewAvatar: { type: Buffer, required: false },

    userId: { type: mongoose.Types.ObjectId, required: true },

    // File information
    files: {
      type: [
        {
          data: {
            type: Buffer,
            min: 3 * 1024,
            max: 5 * 1024 * 1024,
          },
          contentType: {
            type: String,
            required: true,
            enum: getAllFileTypes(),
          },
          fileSize: {
            type: Number,
            required: true,
          },
          fileName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            validate: {
              validator: function (v: string) {
                // Ensure filename UTF-8 encoding is valid and not too long
                return Buffer.byteLength(v, "utf8") <= 300; // Allow for 3x max chars in UTF-8
              },
              message:
                "Filename contains invalid characters or is too long when encoded",
            },
          },
        },
      ],
    },

    isPremium: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: TIME_STAMPS,
    collection: DOCUMENT_COLLECTION_NAME,
    // Ensure UTF-8 encoding for the collection
    collation: { locale: "vi", strength: 2 }, // Vietnamese locale with case-insensitive
  }
);

export default model(DOCUMENT_DOCUMENT_NAME, documentSchema);
