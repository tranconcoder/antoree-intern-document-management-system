import axiosInstance from "./axios.service";
import type {
  Document,
  DocumentFile,
  GetDocumentsResponse,
  GetDocumentResponse,
  DeleteDocumentResponse,
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

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(
        response.data.message || "Failed to fetch self documents"
      );
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

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(
        response.data.message || "Failed to fetch public documents"
      );
    } catch (error) {
      console.error("Error fetching public documents:", error);
      throw error;
    }
  }
}

export default new DocumentService();
