import multer, { type Multer, type StorageEngine } from "multer";
import { isSupportedFileType } from "@/enums/fileType.enum";

class UploadService {
  //   Storage
  public memoryStorage: StorageEngine;

  //   Upload
  public uploadMemory: Multer;

  public constructor() {
    this.memoryStorage = multer.memoryStorage();
    this.uploadMemory = multer({
      storage: this.memoryStorage,
      fileFilter: (req, file, cb) => {
        // Ensure proper UTF-8 encoding for filename
        if (file.originalname) {
          // Decode and re-encode filename to handle UTF-8 properly
          try {
            file.originalname = Buffer.from(
              file.originalname,
              "latin1"
            ).toString("utf8");
          } catch (error) {
            console.log(
              "Filename encoding error, using as-is:",
              file.originalname
            );
          }
        }

        console.log("File filter check:", {
          originalname: file.originalname,
          mimetype: file.mimetype,
          isSupported: isSupportedFileType(file.mimetype),
        });

        if (isSupportedFileType(file.mimetype)) {
          cb(null, true);
        } else {
          const error = new Error(
            `Unsupported file type: ${file.mimetype}`
          ) as any;
          cb(error, false);
        }
      },
    });
  }
}

export default new UploadService();
