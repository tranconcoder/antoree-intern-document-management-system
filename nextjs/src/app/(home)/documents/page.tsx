"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IoDocumentText,
  IoSearch,
  IoAdd,
  IoFilter,
  IoDownload,
  IoEye,
  IoTrash,
  IoTime,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { formatFileSize, getFileTypeDisplay } from "@/configs/upload.config";

// Mock data for now - replace with API call
interface Document {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  fileContentType: string;
  fileSize: number;
  isPremium: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockDocuments: Document[] = [
  {
    _id: "1",
    title: "Báo cáo tài chính Q4 2024",
    description:
      "Báo cáo tổng hợp tình hình tài chính quý 4 năm 2024 của công ty",
    fileName: "bao-cao-tai-chinh-q4-2024.pdf",
    fileContentType: "application/pdf",
    fileSize: 2048576, // 2MB
    isPremium: true,
    isPublic: false,
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "Hướng dẫn sử dụng hệ thống",
    description:
      "Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống quản lý tài liệu",
    fileName: "huong-dan-su-dung.docx",
    fileContentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 1024768, // 1MB
    isPremium: false,
    isPublic: true,
    createdAt: "2024-12-10T14:20:00Z",
    updatedAt: "2024-12-10T14:20:00Z",
  },
];

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const uploaded = searchParams.get("uploaded");
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  useEffect(() => {
    if (uploaded === "true") {
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 5000);
    }
  }, [uploaded]);

  // Filter documents based on search and filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "premium" && doc.isPremium) ||
      (filterType === "public" && doc.isPublic) ||
      (filterType === "private" && !doc.isPublic);

    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showUploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <IoCheckmarkCircle className="w-6 h-6 text-green-500" />
            <div>
              <h4 className="font-medium text-green-800">Upload thành công!</h4>
              <p className="text-green-600">
                Tài liệu của bạn đã được tải lên thành công.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tài liệu của tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và tổ chức tất cả tài liệu của bạn
              </p>
            </div>
            <Link
              href="/documents/upload"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <IoAdd className="w-5 h-5" />
              <span>Tải lên tài liệu</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <IoFilter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="premium">Premium</option>
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <IoDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {searchQuery || filterType !== "all"
                ? "Không tìm thấy tài liệu"
                : "Chưa có tài liệu nào"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterType !== "all"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                : "Bắt đầu bằng cách tải lên tài liệu đầu tiên của bạn"}
            </p>
            <Link
              href="/documents/upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              <IoAdd className="w-5 h-5" />
              <span>Tải lên tài liệu</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Document Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <IoDocumentText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          {getFileTypeDisplay(document.fileContentType)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(document.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {document.isPremium && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-lg">
                          Premium
                        </span>
                      )}
                      {document.isPublic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-lg">
                          Công khai
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

                {/* Document Footer */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <IoTime className="w-4 h-4" />
                      <span>{formatDate(document.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                      <IoEye className="w-4 h-4" />
                      <span className="text-sm">Xem</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1">
                      <IoDownload className="w-4 h-4" />
                      <span className="text-sm">Tải</span>
                    </button>
                    <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <IoTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
