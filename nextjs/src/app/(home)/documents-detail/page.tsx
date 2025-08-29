"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IoDocument,
  IoEye,
  IoCalendar,
  IoShield,
  IoGlobe,
} from "react-icons/io5";
import documentService from "@/services/document.service";
import type { Document } from "@/types/document";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getPublicDocuments();
      setDocuments(docs);
    } catch (err: any) {
      console.error("Error loading documents:", err);
      setError(err.message || "Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 Thư viện tài liệu
            </h1>
            <p className="text-gray-600">
              Khám phá và tải xuống các tài liệu hữu ích
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-8 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoDocument className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải danh sách tài liệu
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDocuments}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            📚 Thư viện tài liệu
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá và tải xuống các tài liệu hữu ích
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
            <IoDocument className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">
              {documents.length} tài liệu có sẵn
            </span>
          </div>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoDocument className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Chưa có tài liệu nào
            </h3>
            <p className="text-gray-500">
              Hãy quay lại sau để xem các tài liệu mới
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">📄</div>
                    <div className="flex space-x-1">
                      {doc.isPremium && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <IoShield className="w-3 h-3 mr-1" />
                          Premium
                        </span>
                      )}
                      {doc.isPublic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <IoGlobe className="w-3 h-3 mr-1" />
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
                    {doc.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <IoCalendar className="w-4 h-4" />
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IoDocument className="w-4 h-4" />
                      <span>
                        {doc.files.length} file{doc.files.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <Link href={`/documents-detail/${doc._id}`}>
                    <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group-hover:shadow-lg">
                      <IoEye className="w-4 h-4" />
                      <span className="font-medium">Xem chi tiết</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
