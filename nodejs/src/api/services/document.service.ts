import documentModel from "@/models/document.model";
import type { UploadDocumentBody } from "@/validator/zod/document.zod";

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
})();
