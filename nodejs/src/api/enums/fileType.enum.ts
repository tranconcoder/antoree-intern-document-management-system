export enum FileType {
  // PDF
  PDF = "application/pdf",

  // Word
  WORD_DOC = "application/msword",
  WORD_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  WORD_WPS_DOCX = "application/wps-office.docx", // WPS Office DOCX format

  // Excel
  EXCEL_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // PowerPoint
  POWERPOINT_PPT = "application/vnd.ms-powerpoint",
  POWERPOINT_PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

// Helper function to get all file types as array
export const getAllFileTypes = (): string[] => {
  return Object.values(FileType);
};

// Helper function to check if a mime type is supported
export const isSupportedFileType = (mimeType: string): boolean => {
  return Object.values(FileType).includes(mimeType as FileType);
};

// Helper function to get file extension from mime type
export const getFileExtension = (mimeType: string): string => {
  switch (mimeType) {
    case FileType.PDF:
      return ".pdf";
    case FileType.WORD_DOC:
      return ".doc";
    case FileType.WORD_DOCX:
    case FileType.WORD_WPS_DOCX:
      return ".docx";
    case FileType.EXCEL_XLSX:
      return ".xlsx";
    case FileType.POWERPOINT_PPT:
      return ".ppt";
    case FileType.POWERPOINT_PPTX:
      return ".pptx";
    default:
      return "";
  }
};

// Helper function to get file category
export const getFileCategory = (mimeType: string): string => {
  switch (mimeType) {
    case FileType.PDF:
      return "PDF";
    case FileType.WORD_DOC:
    case FileType.WORD_DOCX:
    case FileType.WORD_WPS_DOCX:
      return "Word";
    case FileType.EXCEL_XLSX:
      return "Excel";
    case FileType.POWERPOINT_PPT:
    case FileType.POWERPOINT_PPTX:
      return "PowerPoint";
    default:
      return "Unknown";
  }
};
