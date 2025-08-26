import axios, { AxiosProgressEvent } from "axios";
import axiosInstance from "./axios.service";

export interface FileProgressInfo {
  fileId: string;
  progress: number;
  loaded: number;
  total: number;
  status: "pending" | "uploading" | "completed" | "error";
  speed?: number;
  timeRemaining?: number;
}

export interface AllFilesProgressEvent {
  files: FileProgressInfo[];
  overallProgress: number;
  overallLoaded: number;
  overallTotal: number;
  uploadStartTime: number;
}

export interface DocumentUploadData {
  title: string;
  description: string;
  isPremium: boolean;
  isPublic: boolean;
  files: File[];
  fileNames: string[];
  fileSizes: number[];
  contentTypes: string[];
}

export class DocumentUploadService {
  /**
   * Upload multiple files with throttled progress tracking (updates every second)
   */
  static async uploadDocumentWithThrottledProgress(
    data: DocumentUploadData,
    onProgressUpdate?: (progressData: AllFilesProgressEvent) => void
  ) {
    const formData = new FormData();

    // Add basic form data
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("isPremium", data.isPremium.toString());
    formData.append("isPublic", data.isPublic.toString());

    // Calculate total size for overall progress
    const totalSize = data.files.reduce((sum, file) => sum + file.size, 0);
    const uploadStartTime = Date.now();

    // Add files and their metadata
    data.files.forEach((file, index) => {
      formData.append("documents", file);
    });

    // Progress throttling setup
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1000; // 1 second

    const calculateAllFilesProgress = (
      loaded: number,
      total: number
    ): AllFilesProgressEvent => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - uploadStartTime) / 1000;

      // Calculate which file is currently being uploaded
      let runningTotal = 0;
      const filesProgress: FileProgressInfo[] = [];

      for (let i = 0; i < data.files.length; i++) {
        const fileSize = data.files[i].size;
        const nextTotal = runningTotal + fileSize;

        if (loaded <= nextTotal) {
          // This file is currently being uploaded
          const fileLoaded = Math.max(0, loaded - runningTotal);
          const fileProgress = Math.min(
            100,
            Math.round((fileLoaded * 100) / fileSize)
          );

          // Calculate speed and time remaining for current file
          const speed =
            fileLoaded > 0 && elapsedTime > 0 ? fileLoaded / elapsedTime : 0;
          const timeRemaining =
            fileSize > fileLoaded && speed > 0
              ? (fileSize - fileLoaded) / speed
              : 0;

          // Update all files status
          for (let j = 0; j < data.files.length; j++) {
            if (j < i) {
              // Completed files
              filesProgress.push({
                fileId: `file-${j}`,
                progress: 100,
                loaded: data.files[j].size,
                total: data.files[j].size,
                status: "completed",
                speed: 0,
                timeRemaining: 0,
              });
            } else if (j === i) {
              // Current uploading file
              filesProgress.push({
                fileId: `file-${j}`,
                progress: fileProgress,
                loaded: fileLoaded,
                total: fileSize,
                status: "uploading",
                speed: speed,
                timeRemaining: timeRemaining,
              });
            } else {
              // Pending files
              filesProgress.push({
                fileId: `file-${j}`,
                progress: 0,
                loaded: 0,
                total: data.files[j].size,
                status: "pending",
                speed: 0,
                timeRemaining: 0,
              });
            }
          }
          break;
        }
        runningTotal = nextTotal;
      }

      const overallProgress = Math.round((loaded * 100) / total);

      return {
        files: filesProgress,
        overallProgress,
        overallLoaded: loaded,
        overallTotal: total,
        uploadStartTime,
      };
    };

    try {
      const response = await axiosInstance.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;

          const currentTime = Date.now();

          // Only update every second or on completion
          if (
            currentTime - lastUpdateTime >= UPDATE_INTERVAL ||
            progressEvent.loaded === progressEvent.total
          ) {
            lastUpdateTime = currentTime;

            const progressData = calculateAllFilesProgress(
              progressEvent.loaded,
              progressEvent.total
            );

            console.log("Progress update (throttled):", {
              overallProgress: progressData.overallProgress,
              filesCount: progressData.files.length,
              timestamp: new Date().toISOString(),
            });

            if (onProgressUpdate) {
              onProgressUpdate(progressData);
            }
          }
        },
        timeout: 300000, // 5 minutes
      });

      // Final update - mark all files as completed
      if (onProgressUpdate) {
        const finalProgress: AllFilesProgressEvent = {
          files: data.files.map((file, index) => ({
            fileId: `file-${index}`,
            progress: 100,
            loaded: file.size,
            total: file.size,
            status: "completed",
            speed: 0,
            timeRemaining: 0,
          })),
          overallProgress: 100,
          overallLoaded: totalSize,
          overallTotal: totalSize,
          uploadStartTime,
        };

        onProgressUpdate(finalProgress);
      }

      return response.data;
    } catch (error) {
      // Mark all files as error
      if (onProgressUpdate) {
        const errorProgress: AllFilesProgressEvent = {
          files: data.files.map((file, index) => ({
            fileId: `file-${index}`,
            progress: 0,
            loaded: 0,
            total: file.size,
            status: "error",
            speed: 0,
            timeRemaining: 0,
          })),
          overallProgress: 0,
          overallLoaded: 0,
          overallTotal: totalSize,
          uploadStartTime,
        };

        onProgressUpdate(errorProgress);
      }

      throw error;
    }
  }
}

export default DocumentUploadService;

// Export legacy method name for backward compatibility
export const uploadDocumentWithIndividualProgress =
  DocumentUploadService.uploadDocumentWithThrottledProgress;
