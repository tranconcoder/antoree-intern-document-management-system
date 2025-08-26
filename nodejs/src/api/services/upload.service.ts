import multer, { type Multer, type StorageEngine } from "multer";

class UploadService {
  //   Storage
  public memoryStorage: StorageEngine;

  //   Upload
  public uploadMemory: Multer;

  public constructor() {
    this.memoryStorage = multer.memoryStorage();
    this.uploadMemory = multer({ storage: this.memoryStorage });
  }
}

export default new UploadService();
