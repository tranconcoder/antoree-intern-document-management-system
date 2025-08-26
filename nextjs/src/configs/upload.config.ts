// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_FILE_SIZE: 5 * 1024, // 5KB
  MAX_FILES: 10, // Maximum number of files
} as const;

// File size formatter utility
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatUploadSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond === 0) return "0 KB/s";
  const k = 1024;
  const speeds = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
  return (
    parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + " " + speeds[i]
  );
};

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 1) return "< 1s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
};

// File type display utility
export const getFileTypeDisplay = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "application/vnd.ms-powerpoint": "PowerPoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PowerPoint",
  };
  return typeMap[mimeType] || "Unknown";
};
