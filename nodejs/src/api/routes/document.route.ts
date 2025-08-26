import { Router } from "express";
import uploadService from "@/services/upload.service";

const documentRouter = Router();

documentRouter.post(
  "/upload",
  uploadService.uploadMemory.array("documents"),
  (req, res, next) => {
    console.log("=== Upload Request Body ===");
    console.log("Title:", req.body.title);
    console.log("Description:", req.body.description);
    console.log("IsPremium:", req.body.isPremium);
    console.log("IsPublic:", req.body.isPublic);

    // Log metadata arrays
    console.log("FileNames:", req.body.fileNames);
    console.log("FileSizes:", req.body.fileSizes);
    console.log("ContentTypes:", req.body.contentTypes);

    console.log("=== Upload Files ===");
    console.log("Files count:", req.files?.length || 0);

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file, index) => {
        console.log(`File ${index + 1}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname,
        });
      });
    }

    // Send a basic response for now
    res.json({
      success: true,
      message: "Upload received",
      filesCount: req.files?.length || 0,
      metadata: {
        fileNames: req.body.fileNames,
        fileSizes: req.body.fileSizes,
        contentTypes: req.body.contentTypes,
      },
    });
  }
);

export default documentRouter;
