"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";
import {
  IoClose,
  IoArrowBack,
  IoArrowForward,
  IoAdd,
  IoRemove,
} from "react-icons/io5";

// Set up PDF.js worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface FileViewerProps {
  file: {
    data: string;
    fileName: string;
    contentType?: string;
  };
  onClose: () => void;
}

export default function FileViewer({ file, onClose }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [wordContent, setWordContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("FileViewer props:", {
    fileName: file.fileName,
    contentType: file.contentType,
    dataLength: file.data?.length,
    dataPrefix: file.data?.substring(0, 50),
  });

  const isPDF = file.contentType?.includes("pdf");
  const isWord =
    file.contentType?.includes("word") ||
    file.contentType?.includes("document") ||
    file.fileName.endsWith(".docx") ||
    file.fileName.endsWith(".doc");

  useEffect(() => {
    console.log("FileViewer effect triggered:", {
      isWord,
      isPDF,
      fileData: !!file.data,
    });

    if (isWord) {
      loadWordDocument();
    } else if (isPDF) {
      // Validate PDF data
      if (!file.data || typeof file.data !== "string") {
        console.error("PDF data validation failed:", {
          data: !!file.data,
          type: typeof file.data,
        });
        setError("PDF data is missing or invalid");
        setLoading(false);
        return;
      }

      // Check if data looks like base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(file.data)) {
        console.error("PDF data is not valid base64");
        setError("PDF data is not valid base64");
        setLoading(false);
        return;
      }

      console.log(
        "PDF data validation passed, PDF component will handle loading"
      );
      setLoading(false); // Let the PDF Document component handle its own loading
      setError(null);
    } else {
      console.log("File type not supported for preview");
      setLoading(false);
    }
  }, [isWord, isPDF, file.data]);

  const loadWordDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading Word document:", file.fileName);

      // Validate data
      if (!file.data || typeof file.data !== "string") {
        throw new Error("Word document data is missing or invalid");
      }

      // Convert base64 to array buffer
      console.log("Converting base64 to array buffer...");
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const arrayBuffer = new Uint8Array(byteNumbers).buffer;
      console.log("Array buffer created, size:", arrayBuffer.byteLength);

      // Convert Word document to HTML
      console.log("Converting Word to HTML...");
      const result = await mammoth.convertToHtml({ arrayBuffer });
      console.log(
        "Word conversion successful, content length:",
        result.value.length
      );
      setWordContent(result.value);
    } catch (err: any) {
      console.error("Error loading Word document:", err);
      setError(`Không thể hiển thị tài liệu Word: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully, pages:", numPages);
    console.log("Setting numPages and clearing any errors");
    setNumPages(numPages);
    setError(null);
    // Note: We don't set loading to false here because the Document component handles its own loading
  };

  const onDocumentLoadError = (error: any) => {
    console.error("Error loading PDF:", error);
    console.error("PDF data info:", {
      dataLength: file.data?.length,
      dataPrefix: file.data?.substring(0, 100),
      fileName: file.fileName,
      contentType: file.contentType,
    });
    setError(`Không thể hiển thị tài liệu PDF: ${error.message || error}`);
    setLoading(false);
  };

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  // Debug logging
  console.log("Current FileViewer state:", {
    loading,
    error,
    isPDF,
    isWord,
    numPages,
  });

  // If not PDF or Word, show not supported message
  if (!isPDF && !isWord) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Không thể hiển thị file
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            File này không hỗ trợ hiển thị trực tiếp. Chỉ hỗ trợ PDF và Word
            documents.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <IoClose className="w-5 h-5" />
            <span>Đóng</span>
          </button>
          <div>
            <h3 className="font-semibold text-gray-900">{file.fileName}</h3>
            <p className="text-sm text-gray-500">{file.contentType}</p>
          </div>
        </div>

        {/* Controls for PDF */}
        {isPDF && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <IoRemove className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <IoAdd className="w-4 h-4" />
            </button>

            {numPages && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={handlePrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoArrowBack className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[80px] text-center">
                  {pageNumber} / {numPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoArrowForward className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">
                Đang tải {isPDF ? "PDF" : "Word"}...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lỗi hiển thị
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {isPDF &&
          !error &&
          (() => {
            console.log("Rendering PDF viewer with state:", {
              isPDF,
              loading,
              error,
              numPages,
              pageNumber,
              scale,
              dataLength: file.data?.length,
            });

            // Convert base64 to Uint8Array for PDF.js
            const pdfData = (() => {
              try {
                const byteCharacters = atob(file.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                return new Uint8Array(byteNumbers);
              } catch (error) {
                console.error("Error converting base64 to Uint8Array:", error);
                return null;
              }
            })();

            if (!pdfData) {
              return (
                <div className="flex items-center justify-center h-full">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
                    <p className="text-red-600">Lỗi chuyển đổi dữ liệu PDF</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="flex justify-center">
                <Document
                  file={{ data: pdfData }}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="shadow-lg"
                  loading={
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải PDF...</p>
                    </div>
                  }
                >
                  {numPages && (
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="bg-white shadow-lg"
                    />
                  )}
                </Document>
              </div>
            );
          })()}

        {/* Word Viewer */}
        {isWord && !loading && !error && wordContent && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-8 min-h-[600px]">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: wordContent }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
