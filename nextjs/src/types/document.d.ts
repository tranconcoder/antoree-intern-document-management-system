export interface DocumentFile {
  data?: string;
  contentType?: string;
  fileSize: number;
  fileName: string;
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  previewAvatar?: string; // Base64 string for frontend
  userId: string;
  files: DocumentFile[];
  isPremium: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface GetDocumentsResponse {
  metadata: Document[];
}

export interface GetDocumentResponse {
  metadata: Document;
  successHttpCode: number;
}

export interface GetDocumentFileDataResponse {
  success?: boolean;
  successHttpCode?: number;
  metadata: {
    files: Array<{
      data: string;
      contentType: string;
      fileSize: number;
      fileName: string;
    }>;
  };
}

export interface DeleteDocumentResponse {
  success: boolean;
  message?: string;
}

// Legacy types for backward compatibility
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
