"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IoSearch,
  IoFilter,
  IoCheckmarkCircle,
  IoRefresh,
} from "react-icons/io5";
import DocumentService from "@/services/document.service";
import DocumentList from "@/components/documents/DocumentList";
import type { Document } from "@/types/document";

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const uploaded = searchParams.get("uploaded");

  // State management
  const [selfDocuments, setSelfDocuments] = useState<Document[]>([]);
  const [publicDocuments, setPublicDocuments] = useState<Document[]>([]);
  const [isLoadingSelf, setIsLoadingSelf] = useState(true);
  const [isLoadingPublic, setIsLoadingPublic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show upload success message
  useEffect(() => {
    if (uploaded === "true") {
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 5000);
    }
  }, [uploaded]);

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setError(null);

      // Load self documents
      setIsLoadingSelf(true);
      try {
        const selfDocs = await DocumentService.getSelfDocuments();
        setSelfDocuments(selfDocs);
      } catch (selfError) {
        console.error("Error loading self documents:", selfError);
        setSelfDocuments([]);
      } finally {
        setIsLoadingSelf(false);
      }

      // Load public documents
      setIsLoadingPublic(true);
      try {
        const publicDocs = await DocumentService.getPublicDocuments();
        setPublicDocuments(publicDocs);
      } catch (publicError) {
        console.error("Error loading public documents:", publicError);
        setPublicDocuments([]);
      } finally {
        setIsLoadingPublic(false);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      setError("Có lỗi xảy ra khi tải tài liệu. Vui lòng thử lại.");
    }
  };

  // Filter documents based on search and filter
  const filterDocuments = (documents: Document[]) => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.files.some((file) =>
          file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        filterType === "all" ||
        (filterType === "premium" && doc.isPremium) ||
        (filterType === "public" && doc.isPublic) ||
        (filterType === "private" && !doc.isPublic);

      return matchesSearch && matchesFilter;
    });
  };

  const filteredSelfDocuments = filterDocuments(selfDocuments);
  const filteredPublicDocuments = filterDocuments(publicDocuments);

  // Handle document actions
  const handleDeleteDocument = async (documentId: string) => {
    try {
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Có lỗi xảy ra khi xóa tài liệu");
    }
  };

  const handleDownloadFile = async (
    documentId: string,
    fileIndex: number,
    fileName: string
  ) => {};

  const handleViewDocument = (documentId: string) => {
    // Open document details in a new tab or modal
    window.open(`/documents-detail/${documentId}`, "_blank");
  };

  const handleRefresh = () => {
    loadDocuments();
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-red-800">Có lỗi xảy ra</h4>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý tài liệu
          </h1>
          <p className="text-gray-600">
            Tài liệu của bạn và tài liệu công khai từ cộng đồng
          </p>
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

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoadingSelf || isLoadingPublic}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <IoRefresh
                className={`w-4 h-4 ${
                  isLoadingSelf || isLoadingPublic ? "animate-spin" : ""
                }`}
              />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Document Sections */}
        <div className="space-y-12">
          {/* My Documents Section */}
          <DocumentList
            documents={filteredSelfDocuments}
            title="Tài liệu của tôi"
            description={`${selfDocuments.length} tài liệu • Tài liệu bạn đã tải lên`}
            isLoading={isLoadingSelf}
            isOwner={true}
            showUploadButton={true}
            onDelete={handleDeleteDocument}
            onDownloadFile={handleDownloadFile}
            onViewDocument={handleViewDocument}
          />

          {/* Public Documents Section */}
          <DocumentList
            documents={filteredPublicDocuments}
            title="Tài liệu của mọi người"
            description={`${publicDocuments.length} tài liệu • Tài liệu công khai từ cộng đồng`}
            isLoading={isLoadingPublic}
            isOwner={false}
            showUploadButton={false}
            onDownloadFile={handleDownloadFile}
            onViewDocument={handleViewDocument}
          />
        </div>
      </div>
    </div>
  );
}
