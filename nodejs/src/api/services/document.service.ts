import documentModel from "@/models/document.model";
import type { UploadDocumentBody } from "@/validator/zod/document.zod";
import mongoose from "mongoose";

export default new (class DocumentService {
  // Helper method to ensure proper UTF-8 encoding
  private ensureUTF8String(str: string): string {
    try {
      // Check if string is properly UTF-8 encoded
      const buffer = Buffer.from(str, "utf8");
      const decoded = buffer.toString("utf8");

      // If the round-trip encoding/decoding changes the string, it's likely incorrectly encoded
      if (decoded !== str) {
        // Try to fix latin1 -> utf8 encoding issue
        const latin1Buffer = Buffer.from(str, "latin1");
        const utf8String = latin1Buffer.toString("utf8");

        // Validate the result makes sense (basic check for common Vietnamese characters)
        if (
          /^[\u0000-\u007F\u00C0-\u1EF9\s\w\d\-_.()[\]{}]+$/.test(utf8String)
        ) {
          console.log(`Fixed encoding for: "${str}" -> "${utf8String}"`);
          return utf8String;
        }
      }

      return str;
    } catch (error) {
      console.warn(`Encoding warning for string: "${str}":`, error);
      return str;
    }
  }

  async uploadDocuments(
    body: UploadDocumentBody,
    files: Express.Multer.File[],
    userId: string
  ) {
    console.log("Upload documents service called:", {
      bodyTitle: body.title,
      filesCount: files.length,
      userId,
      files: files.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        bufferLength: f.buffer?.length,
      })),
    });

    // Ensure UTF-8 encoding for title and description
    const sanitizedBody = {
      ...body,
      title: this.ensureUTF8String(body.title),
      description: this.ensureUTF8String(body.description),
    };

    const filesToSave = files.map((file) => {
      // Ensure filename is properly UTF-8 encoded
      let fileName = this.ensureUTF8String(file.originalname);

      console.log(`Processing file: "${file.originalname}" -> "${fileName}"`);

      return {
        data: file.buffer,
        contentType: file.mimetype,
        fileSize: file.size,
        fileName: fileName,
      };
    });

    console.log(
      "Files to save:",
      filesToSave.map((f) => ({
        fileName: f.fileName,
        contentType: f.contentType,
        fileSize: f.fileSize,
        hasData: !!f.data,
      }))
    );

    try {
      const savedDoc = await documentModel.create({
        title: sanitizedBody.title,
        description: sanitizedBody.description,
        userId: userId,
        files: filesToSave,
        isPremium: sanitizedBody.isPremium,
        isPublic: sanitizedBody.isPublic,
      });

      console.log("Document saved successfully:", savedDoc._id.toString());
      return savedDoc._id.toString();
    } catch (error) {
      console.error("Error saving document:", error);
      throw error;
    }
  }

  async getSelfDocuments(userId: string) {
    return documentModel.find({ userId }, { "files.data": 0 });
  }

  async getPublicDocuments() {
    return documentModel.find({ isPublic: true }, { "files.data": 0 });
  }

  async getDocumentById(documentId: string) {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error("Invalid document ID format");
    }

    const document = await documentModel.findById(documentId, {
      "files.data": 0,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  }

  async getDocumentFileData(documentId: string) {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error("Invalid document ID format");
    }

    const document = await documentModel.findById(documentId, {
      files: 1,
      _id: 1,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Convert file data from Buffer to base64 for frontend
    const filesWithBase64Data = document.files.map((file) => ({
      data: file.data.toString("base64"),
      contentType: file.contentType,
      fileSize: file.fileSize,
      fileName: file.fileName,
    }));

    return {
      _id: document._id,
      files: filesWithBase64Data,
    };
  }

  async deleteSelfDocument(documentId: string, userId: string) {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      throw new Error("Invalid document ID format");
    }

    console.log(
      `Attempting to delete document ${documentId} for user ${userId}`
    );

    // Find document and ensure it belongs to the user
    const document = await documentModel.findOne({
      _id: documentId,
      userId: userId,
    });

    if (!document) {
      throw new Error(
        "Document not found or you don't have permission to delete it"
      );
    }

    // Delete the document
    await documentModel.findByIdAndDelete(documentId);

    console.log(`Document ${documentId} deleted successfully`);
    return {
      deleted: true,
      documentId: documentId,
      message: "Document deleted successfully",
    };
  }
})();
