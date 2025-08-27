import { HttpStatusCode } from "axios";
import axiosInstance from "./axios.service";
import type { Document, GetDocumentsResponse } from "@/types/document";

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
}

export default new DocumentService();
