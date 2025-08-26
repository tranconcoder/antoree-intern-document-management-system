"use client";

import React, { useState } from "react";
import {
  IoDocumentText,
  IoDownload,
  IoEye,
  IoTrash,
  IoTime,
  IoChevronDown,
  IoChevronUp,
  IoFileTray,
  IoLockClosed,
  IoGlobe,
} from "react-icons/io5";
import { formatFileSize, getFileTypeDisplay } from "@/configs/upload.config";
import type { Document, DocumentFile } from "@/types/document";

interface DocumentCardProps {
  document: Document;
  onDelete?: (documentId: string) => void;
  onDownloadFile?: (
    documentId: string,
    fileIndex: number,
    fileName: string
  ) => void;
  onViewDocument?: (documentId: string) => void;
  isOwner?: boolean;
}

export default function DocumentCard({
  document,
  onDelete,
  onDownloadFile,
  onViewDocument,
  isOwner = false,
}: DocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total size of all files
  const totalSize = document.files.reduce(
    (sum, file) => sum + file.fileSize,
    0
  );

  // Get primary file (first file) for display
  const primaryFile = document.files[0];
  const additionalFilesCount = document.files.length - 1;

  const handleFileDownload = (fileIndex: number, fileName: string) => {
    if (onDownloadFile) {
      onDownloadFile(document._id, fileIndex, fileName);
    }
  };

  const handleDocumentView = () => {
    if (onViewDocument) {
      onViewDocument(document._id);
    }
  };

  const handleDelete = () => {
    if (onDelete && isOwner) {
      if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${document.title}"?`)) {
        onDelete(document._id);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Document Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              {document.previewAvatar ? (
                <img
                  src={`data:image/jpeg;base64,${document.previewAvatar}`}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <IoDocumentText className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">
                {document.files.length} files
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(totalSize)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {document.isPremium && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-lg flex items-center space-x-1">
                <IoLockClosed className="w-3 h-3" />
                <span>Premium</span>
              </span>
            )}
            {document.isPublic && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg flex items-center space-x-1">
                <IoGlobe className="w-3 h-3" />
                <span>Công khai</span>
              </span>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {document.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {document.description}
        </p>
      </div>

      {/* Primary File Info */}
      {primaryFile && (
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <IoDocumentText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                  {primaryFile.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {getFileTypeDisplay(primaryFile.contentType)} •{" "}
                  {formatFileSize(primaryFile.fileSize)}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleFileDownload(0, primaryFile.fileName)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Tải xuống"
            >
              <IoDownload className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Additional Files (if any) */}
      {additionalFilesCount > 0 && (
        <div className="px-6 py-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <IoFileTray className="w-4 h-4" />
              <span>Còn {additionalFilesCount} file khác</span>
            </div>
            {isExpanded ? (
              <IoChevronUp className="w-4 h-4" />
            ) : (
              <IoChevronDown className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="space-y-2 pb-2">
              {document.files.slice(1).map((file, index) => (
                <div
                  key={index + 1}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <IoDocumentText className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 truncate max-w-48">
                        {file.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileTypeDisplay(file.contentType)} •{" "}
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFileDownload(index + 1, file.fileName)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Tải xuống"
                  >
                    <IoDownload className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Document Footer */}
      <div className="p-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <IoTime className="w-4 h-4" />
            <span>{formatDate(document.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDocumentView}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
          >
            <IoEye className="w-4 h-4" />
            <span className="text-sm">Xem chi tiết</span>
          </button>

          {isOwner && onDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              title="Xóa tài liệu"
            >
              <IoTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
