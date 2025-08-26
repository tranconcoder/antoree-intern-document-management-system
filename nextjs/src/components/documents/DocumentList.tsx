"use client";

import React from "react";
import { IoDocumentText, IoAdd } from "react-icons/io5";
import Link from "next/link";
import DocumentCard from "./DocumentCard";
import type { Document } from "@/types/document";

interface DocumentListProps {
  documents: Document[];
  title: string;
  description: string;
  isLoading?: boolean;
  isOwner?: boolean;
  showUploadButton?: boolean;
  onDelete?: (documentId: string) => void;
  onDownloadFile?: (
    documentId: string,
    fileIndex: number,
    fileName: string
  ) => void;
  onViewDocument?: (documentId: string) => void;
}

export default function DocumentList({
  documents,
  title,
  description,
  isLoading = false,
  isOwner = false,
  showUploadButton = false,
  onDelete,
  onDownloadFile,
  onViewDocument,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="flex space-x-2">
                  <div className="flex-1 h-9 bg-gray-300 rounded-lg"></div>
                  <div className="w-9 h-9 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {showUploadButton && (
          <Link
            href="/documents/upload"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <IoAdd className="w-4 h-4" />
            <span>Tải lên</span>
          </Link>
        )}
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <IoDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            Chưa có tài liệu nào
          </h3>
          <p className="text-gray-400 mb-6">
            {isOwner
              ? "Bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn"
              : "Chưa có tài liệu công khai nào được chia sẻ"}
          </p>
          {showUploadButton && (
            <Link
              href="/documents/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              <IoAdd className="w-5 h-5" />
              <span>Tải lên tài liệu</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              isOwner={isOwner}
              onDelete={onDelete}
              onDownloadFile={onDownloadFile}
              onViewDocument={onViewDocument}
            />
          ))}
        </div>
      )}

      {/* Document Count */}
      {documents.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Hiển thị {documents.length} tài liệu
        </div>
      )}
    </div>
  );
}
