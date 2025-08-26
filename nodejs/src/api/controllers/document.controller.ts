import type { UploadDocumentBody } from "@/validator/zod/document.zod";
import type { RequestHandler } from "express";

import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/success";
import documentService from "@/services/document.service";

export default new (class DocumentController {
  uploadDocuments: RequestHandler = async (req, res) => {
    const body = req.body as UploadDocumentBody;
    const files = req.files as Express.Multer.File[];

    new SuccessResponse({
      successResponseItem: successResponses.DOCUMENT_UPLOAD_SUCCESS,
      metadata: await documentService.uploadDocuments(body, files),
    }).sendResponse(res);
  };
})();
