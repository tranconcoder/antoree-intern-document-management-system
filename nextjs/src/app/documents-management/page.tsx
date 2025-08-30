"use client";

import { useEffect, useState } from "react";
import { DeleteDocumentButton } from "@/components/documents/DeleteDocumentButton";
import documentService from "@/services/document.service";
import type { Document } from "@/types/document";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackCustomEvent } = useAnalytics();

  useEffect(() => {
    trackCustomEvent("page_view", "documents", "documents-management");
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getSelfDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      alert("Có lỗi xảy ra khi tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentDeleted = () => {
    // Reload documents after deletion
    loadDocuments();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileCount = (files: any[]) => {
    return files?.length || 0;
  };

  const getTotalSize = (files: any[]) => {
    if (!files || files.length === 0) return 0;
    return files.reduce((total, file) => total + (file.fileSize || 0), 0);
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || isNaN(bytes) || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải tài liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài liệu</h1>
          <p className="mt-2 text-gray-600">
            Danh sách tài liệu của bạn ({documents.length} tài liệu)
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Chưa có tài liệu
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Bạn chưa upload tài liệu nào. Hãy upload tài liệu đầu tiên!
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {documents.map((document) => (
                <li key={document._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">📄</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {document.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {document.description}
                          </p>
                          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              📁 {getFileCount(document.files)} file(s)
                            </span>
                            <span>
                              📊 {formatFileSize(getTotalSize(document.files))}
                            </span>
                            <span>🕒 {formatDate(document.createdAt)}</span>
                            {document.isPremium && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Premium
                              </span>
                            )}
                            {document.isPublic && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          window.open(`/documents/${document._id}`, "_blank")
                        }
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Xem
                      </button>
                      <DeleteDocumentButton
                        documentId={document._id}
                        documentTitle={document.title}
                        onDeleted={handleDocumentDeleted}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
