import { Router } from "express";
import uploadService from "@/services/upload.service";
import validateZodPayload from "@/middlewares/zod.middleware";
import { RequestSource } from "@/enums/requestSource.enum";
import { uploadDocumentBody } from "@/validator/zod/document.zod";
import documentController from "@/controllers/document.controller";
import { validateToken } from "@/middlewares/auth.middleware";

const documentRouter = Router();

documentRouter.post(
  "/upload",
  validateToken,
  uploadService.uploadMemory.array("documents"),
  validateZodPayload(RequestSource.Body, uploadDocumentBody),
  documentController.uploadDocuments
);

documentRouter.get("/self", validateToken, documentController.getSelfDocuments);

documentRouter.get("/public", documentController.getPublicDocuments);

export default documentRouter;
