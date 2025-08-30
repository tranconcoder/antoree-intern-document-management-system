"use client";

import { useState } from "react";
import { X, AlertTriangle, Trash2, FileText } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import DocumentService from "@/services/document.service";

interface DeleteDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  documentFileCount?: number;
  documentSize?: string;
  onDeleted?: () => void;
}

export function DeleteDocumentDialog({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  documentFileCount = 0,
  documentSize = "0 KB",
  onDeleted,
}: DeleteDocumentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { trackCustomEvent } = useAnalytics();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);

      await DocumentService.deleteSelfDocument(documentId);

      // Track successful deletion
      trackCustomEvent("document_delete_success", "document", documentId);

      onDeleted?.();
      onClose();
    } catch (error) {
      console.error("Error during deletion:", error);
      trackCustomEvent("document_delete_error", "document", documentId);
      alert("Có lỗi xảy ra khi xóa tài liệu. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto transition-all duration-300 ${
        isOpen ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Xác nhận xóa tài liệu
              </h3>
              <p className="text-sm text-gray-500">
                Hành động này không thể hoàn tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa tài liệu này không?
            </p>

            {/* Document Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {documentTitle}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{documentFileCount} file(s)</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{documentSize}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-2">Cảnh báo quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Tài liệu sẽ bị xóa vĩnh viễn khỏi hệ thống</li>
                  <li>Tất cả file đính kèm sẽ bị mất hoàn toàn</li>
                  <li>Không thể khôi phục sau khi xóa</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 border border-transparent rounded-xl shadow-sm hover:from-red-700 hover:to-red-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tài liệu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
