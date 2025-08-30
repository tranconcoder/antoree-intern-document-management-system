"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IoArrowBack,
  IoDownload,
  IoEye,
  IoCalendar,
  IoDocument,
  IoPerson,
  IoShield,
  IoGlobe,
} from "react-icons/io5";
import documentService from "@/services/document.service";
import FileViewer from "@/components/documents/FileViewer";
import type { Document } from "@/types/document";
import { HttpStatusCode } from "axios";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [fileData, setFileData] = useState<Array<{
    data: string;
    contentType: string;
    fileSize: number;
    fileName: string;
  }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<any | null>(null);

  useEffect(() => {
    if (documentId) {
      loadDocument();
      // Also load file data for preview capability
      loadFileData();
    }
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      console.log("Loading document metadata for ID:", documentId);
      const response = await documentService.getDocumentById(documentId);
      console.log("Document response:", response);

      if (response.successHttpCode === HttpStatusCode.Ok && response.metadata) {
        const doc = response.metadata;
        console.log("Document metadata loaded:", doc);
        setDocument(doc);
      } else {
        setError("Failed to load document");
      }
    } catch (err) {
      console.error("Error loading document:", err);
      setError("Error loading document");
    } finally {
      setLoading(false);
    }
  };

  const loadFileData = async () => {
    try {
      console.log("Loading file data for document ID:", documentId);
      const response = await documentService.getDocumentFileData(documentId);
      console.log("File data response:", response);

      // Check for the correct response structure based on your backend
      if (
        (response.successHttpCode === HttpStatusCode.Ok || response.success) &&
        response.metadata &&
        response.metadata.files
      ) {
        setFileData(response.metadata.files);
        console.log("File data loaded:", response.metadata.files);
      }
    } catch (err) {
      console.error("Error loading file data:", err);
      console.error("Error details:", err instanceof Error ? err.message : err);
    }
  };

  const handleDownload = async (fileName: string, index: number) => {
    try {
      setDownloading(`${index}`);

      // Load file data if not already loaded
      if (!fileData) {
        await loadFileData();
        // Wait a bit for state to update
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Find the file with actual data
      const fileWithData = fileData?.find((f) => f.fileName === fileName);
      if (!fileWithData) {
        throw new Error("File data not found");
      }

      console.log("File to download:", fileWithData);
      await documentService.downloadFile(fileWithData);
    } catch (err: any) {
      console.error("Error downloading file:", err);
      setError("Không thể tải xuống file");
    } finally {
      setDownloading(null);
    }
  };

  const handleViewFile = async (fileName: string) => {
    try {
      console.log("Viewing file:", fileName);

      // Load file data if not already loaded
      if (!fileData) {
        await loadFileData();
        // Wait a bit for state to update
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const file = fileData?.find((f) => f.fileName === fileName);

      if (file) {
        setViewingFile(file);
      } else {
        console.error("File not found for viewing:", fileName);
      }
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };
  const handleCloseViewer = () => {
    setViewingFile(null);
  };

  const canPreview = (fileName: string, contentType?: string) => {
    if (!fileData) {
      console.log("No file data available for preview check");
      return false;
    }

    const file = fileData.find((f) => f.fileName === fileName);
    if (!file) {
      console.log("File not found in file data:", fileName);
      return false;
    }

    const type = contentType || file.contentType;
    console.log("Checking preview for file:", fileName, "type:", type);

    if (!type) {
      console.log("No content type available");
      return false;
    }

    // Check by content type first
    const previewableTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "application/wps-office.docx", // WPS Office .docx
    ];

    // Check if content type is directly supported
    if (previewableTypes.includes(type)) {
      console.log("Can preview by content type:", true);
      return true;
    }

    // Check by file extension as fallback
    const lowerFileName = fileName.toLowerCase();
    const isWordFile =
      lowerFileName.endsWith(".docx") || lowerFileName.endsWith(".doc");
    const isPdfFile = lowerFileName.endsWith(".pdf");

    // Additional checks for Word files with generic content types
    const isWordContentType =
      type.includes("word") ||
      type.includes("document") ||
      type.includes("wordprocessingml") ||
      type.includes("msword") ||
      type.includes("wps-office");

    const canPreviewFile = isPdfFile || isWordFile || isWordContentType;
    console.log("Can preview by extension/content check:", canPreviewFile, {
      isWordFile,
      isPdfFile,
      isWordContentType,
      fileName: lowerFileName,
      contentType: type,
    });

    return canPreviewFile;
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return "N/A";
      }

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Invalid date";
      }

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error, "dateString:", dateString);
      return "Error formatting date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Loading Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-32"></div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3 mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <IoArrowBack className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoDocument className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải tài liệu
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDocument}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Không tìm thấy tài liệu
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <IoArrowBack className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Document Info */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{document.title}</h1>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {document.description}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                {document.isPremium && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <IoShield className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                )}
                {document.isPublic && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <IoGlobe className="w-4 h-4 mr-1" />
                    Public
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IoCalendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ngày tạo</div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(document.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <IoDocument className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Số file</div>
                    <div className="font-semibold text-gray-900">
                      {document.files.length} file
                      {document.files.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IoPerson className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Người tạo</div>
                    <div className="font-semibold text-gray-900 truncate">
                      {document.userId}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <IoDocument className="w-6 h-6 mr-2 text-blue-600" />
                Danh sách file
              </h3>

              <div className="space-y-3">
                {document.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-2xl">
                        {documentService.getFileIcon(file.contentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {file.fileName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {file.contentType || "Unknown type"} •{" "}
                          {documentService.formatFileSize(file.fileSize)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {canPreview(file.fileName, file.contentType) && (
                        <button
                          onClick={() => handleViewFile(file.fileName)}
                          className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium shadow-sm"
                          title={`Xem trước ${
                            file.contentType?.includes("pdf")
                              ? "PDF"
                              : "Word document"
                          }`}
                        >
                          <IoEye className="w-3 h-3 mr-1" />
                          Xem trước
                        </button>
                      )}

                      <button
                        onClick={() => handleDownload(file.fileName, index)}
                        disabled={downloading === `${index}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        title="Tải xuống file"
                      >
                        {downloading === `${index}` ? (
                          <>
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <IoDownload className="w-4 h-4 mr-2" />
                            Tải xuống
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <FileViewer file={viewingFile} onClose={handleCloseViewer} />
      )}
    </div>
  );
}
