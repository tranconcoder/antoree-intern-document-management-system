import { Router } from "express";
import uploadService from "@/services/upload.service";

const documentRouter = Router();

documentRouter.post("/upload", uploadService.uploadMemory.array("documents"));

export default documentRouter;
