import documentModel from "@/models/document.model";
import type { UploadDocumentBody } from "@/validator/zod/document.zod";
import mongoose from "mongoose";

export default new (class DocumentService {
  async uploadDocuments(
    body: UploadDocumentBody,
    files: Express.Multer.File[],
    userId: string
  ) {
    const filesToSave = files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
      fileSize: file.size,
      fileName: file.originalname,
    }));

    const savedDoc = await documentModel.create({
      title: body.title,
      description: body.description,

      userId: userId,

      files: filesToSave,

      isPremium: body.isPremium,
      isPublic: body.isPublic,
    });

    return savedDoc._id.toString();
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
})();
