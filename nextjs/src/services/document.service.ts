import { HttpStatusCode } from "axios";
import axiosInstance from "./axios.service";
import type {
  Document,
  GetDocumentsResponse,
  GetDocumentResponse,
  GetDocumentFileDataResponse,
} from "@/types/document";

class DocumentService {
  /**
   * Get self documents (documents uploaded by current user)
   */
  async getSelfDocuments(): Promise<Document[]> {
    try {
      const response = await axiosInstance.get<GetDocumentsResponse>(
        "/documents/self"
      );

      if (response.status === HttpStatusCode.Ok) {
        return response.data.metadata;
      }

      throw new Error("Failed to fetch self documents");
    } catch (error) {
      console.error("Error fetching self documents:", error);
      throw error;
    }
  }

  /**
   * Get public documents (documents shared by all users)
   */
  async getPublicDocuments(): Promise<Document[]> {
    try {
      const response = await axiosInstance.get<GetDocumentsResponse>(
        "/documents/public"
      );

      if (response.status === HttpStatusCode.Ok) {
        return response.data.metadata;
      }

      throw new Error("Failed to fetch public documents");
    } catch (error) {
      console.error("Error fetching public documents:", error);
      throw error;
    }
  }

  /**
   * Get document by ID với full data including files
   */
  async getDocumentById(id: string): Promise<GetDocumentResponse> {
    try {
      const response = await axiosInstance.get<GetDocumentResponse>(
        `/documents/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  }

  async getDocumentFileData(id: string): Promise<GetDocumentFileDataResponse> {
    try {
      const response = await axiosInstance.get<GetDocumentFileDataResponse>(
        `/documents/${id}/file-data`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching document file data:", error);
      throw error;
    }
  }

  /**
   * Delete document by ID
   */
  async deleteDocument(
    id: string
  ): Promise<{ deleted: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`/documents/${id}`);

      if (response.status === HttpStatusCode.Ok) {
        return response.data.metadata;
      }

      throw new Error("Failed to delete document");
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  /**
   * Delete self document by ID (only documents owned by current user)
   */
  async deleteSelfDocument(
    id: string
  ): Promise<{ deleted: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`/documents/${id}`);

      if (response.status === HttpStatusCode.Ok) {
        return response.data.metadata;
      }

      throw new Error("Failed to delete self document");
    } catch (error) {
      console.error("Error deleting self document:", error);
      throw error;
    }
  }

  /**
   * Download file từ document
   */
  downloadFile(file: { data: string; fileName: string; contentType?: string }) {
    try {
      console.log(
        "Downloading file:",
        file.fileName,
        "data length:",
        file.data?.length
      );

      // Validate base64 data
      if (!file.data || typeof file.data !== "string") {
        throw new Error("Invalid file data: data is missing or not a string");
      }

      // Check if data looks like base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(file.data)) {
        throw new Error("Invalid file data: not a valid base64 string");
      }

      // Convert base64 to blob
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: file.contentType || "application/octet-stream",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (!bytes || isNaN(bytes) || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Get file type icon
   */
  getFileIcon(contentType?: string): string {
    // Handle undefined, null or empty contentType
    if (!contentType || typeof contentType !== "string") {
      return "📁";
    }

    const type = contentType.toLowerCase();
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (type.includes("video")) return "🎥";
    if (type.includes("audio")) return "🎵";
    if (type.includes("text")) return "📝";
    if (type.includes("word")) return "📝";
    if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
    if (type.includes("powerpoint") || type.includes("presentation"))
      return "📊";
    return "📁";
  }
}

export default new DocumentService();
