export interface DocumentFile {
  data: string; // Base64 string for frontend display
  contentType: string;
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
  success: boolean;
  data: Document[];
  message?: string;
}

export interface GetDocumentResponse {
  success: boolean;
  data: Document;
  message?: string;
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
