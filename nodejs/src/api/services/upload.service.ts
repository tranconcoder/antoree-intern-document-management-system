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
