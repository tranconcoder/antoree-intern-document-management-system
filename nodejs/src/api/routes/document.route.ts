import { Router } from "express";
import uploadService from "@/services/upload.service";
import validateZodPayload from "@/middlewares/zod.middleware";
import { RequestSource } from "@/enums/requestSource.enum";
import { uploadDocumentBody } from "@/validator/zod/document.zod";
import documentController from "@/controllers/document.controller";

const documentRouter = Router();

documentRouter.post(
  "/upload",
  uploadService.uploadMemory.array("documents"),
  validateZodPayload(RequestSource.Body, uploadDocumentBody),
  documentController.uploadDocuments
);

export default documentRouter;
