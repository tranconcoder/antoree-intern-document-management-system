export interface DocumentFile {
  data: Buffer;
  contentType: string;
  fileSize: number;
  fileName: string;
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  previewAvatar?: Buffer;
  files: DocumentFile[];
  isPremium: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data?: {
    document: Document;
  };
  error?: string;
}

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data?: {
    documents: Document[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  error?: string;
}
