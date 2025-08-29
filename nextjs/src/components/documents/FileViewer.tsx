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
    file.contentType?.includes("wordprocessingml") ||
    file.contentType?.includes("msword") ||
    file.contentType?.includes("wps-office.docx") ||
    file.contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.contentType === "application/msword" ||
    file.contentType === "application/wps-office.docx" ||
    file.fileName.toLowerCase().endsWith(".docx") ||
    file.fileName.toLowerCase().endsWith(".doc");

  console.log("File type detection:", {
    fileName: file.fileName,
    contentType: file.contentType,
    isPDF,
    isWord,
    fileNameLower: file.fileName.toLowerCase(),
    endsWithDocx: file.fileName.toLowerCase().endsWith(".docx"),
    endsWithDoc: file.fileName.toLowerCase().endsWith(".doc"),
    isExactDocxMime:
      file.contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    isExactDocMime: file.contentType === "application/msword",
    isWpsDocxMime: file.contentType === "application/wps-office.docx",
  });

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

      // Validate base64 format
      const base64Regex = /^[A-Za-z0-9+/\s]*={0,2}$/;
      const cleanBase64 = file.data.replace(/\s/g, "");

      if (!base64Regex.test(cleanBase64) || cleanBase64.length < 100) {
        throw new Error("Invalid base64 data format");
      }

      // Convert base64 to array buffer
      console.log("Converting base64 to array buffer...");
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const arrayBuffer = new Uint8Array(byteNumbers).buffer;
      console.log("Array buffer created, size:", arrayBuffer.byteLength);

      // Convert Word document to HTML with better options
      console.log("Converting Word to HTML...");
      const result = await mammoth.convertToHtml(
        {
          arrayBuffer,
        },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1:fresh",
            "p[style-name='Heading 2'] => h2:fresh",
            "p[style-name='Heading 3'] => h3:fresh",
            "p[style-name='Heading 4'] => h4:fresh",
            "p[style-name='Title'] => h1.title:fresh",
            "p[style-name='Subtitle'] => h2.subtitle:fresh",
          ],
          ignoreEmptyParagraphs: false,
          convertImage: mammoth.images.imgElement(function (image) {
            return image.read("base64").then(function (imageBuffer) {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer,
              };
            });
          }),
        }
      );

      console.log("Word conversion successful:", {
        contentLength: result.value.length,
        messagesCount: result.messages.length,
        hasWarnings: result.messages.some((m) => m.type === "warning"),
        hasErrors: result.messages.some((m) => m.type === "error"),
      });

      // Log any conversion messages for debugging
      if (result.messages.length > 0) {
        console.log("Mammoth conversion messages:", result.messages);
      }

      if (!result.value || result.value.trim().length === 0) {
        throw new Error(
          "Document appears to be empty or could not be converted"
        );
      }

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
    console.log("File not supported - Debug info:", {
      fileName: file.fileName,
      contentType: file.contentType,
      isPDF,
      isWord,
    });

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
          <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
            <div>File: {file.fileName}</div>
            <div>Type: {file.contentType || "Không xác định"}</div>
          </div>
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

        {/* Controls for PDF and Word */}
        {(isPDF || isWord) && (
          <div className="flex items-center space-x-2">
            {/* Zoom controls for both PDF and Word */}
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Phóng to"
            >
              <IoRemove className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Thu nhỏ"
            >
              <IoAdd className="w-4 h-4" />
            </button>

            {/* Page navigation only for PDF */}
            {isPDF && numPages && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={handlePrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang trước"
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
                  title="Trang sau"
                >
                  <IoArrowForward className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Word document info */}
            {isWord && !loading && !error && wordContent && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <span className="text-sm text-gray-600">Word Document</span>
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
          <div className="flex justify-center">
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden max-w-5xl w-full"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <div className="p-8 min-h-[800px]">
                <style jsx>{`
                  .word-content h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 1.5rem 0 1rem 0;
                    color: #1a202c;
                  }
                  .word-content h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 1.25rem 0 0.75rem 0;
                    color: #2d3748;
                  }
                  .word-content h3 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 1rem 0 0.5rem 0;
                    color: #4a5568;
                  }
                  .word-content h4 {
                    font-size: 1.125rem;
                    font-weight: bold;
                    margin: 0.75rem 0 0.5rem 0;
                    color: #4a5568;
                  }
                  .word-content p {
                    margin: 0.75rem 0;
                    line-height: 1.6;
                  }
                  .word-content ul,
                  .word-content ol {
                    margin: 0.75rem 0;
                    padding-left: 1.5rem;
                  }
                  .word-content li {
                    margin: 0.25rem 0;
                  }
                  .word-content table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1rem 0;
                  }
                  .word-content td,
                  .word-content th {
                    border: 1px solid #e2e8f0;
                    padding: 0.5rem;
                    text-align: left;
                  }
                  .word-content th {
                    background-color: #f7fafc;
                    font-weight: bold;
                  }
                  .word-content img {
                    max-width: 100%;
                    height: auto;
                    margin: 1rem 0;
                  }
                  .word-content strong {
                    font-weight: bold;
                  }
                  .word-content em {
                    font-style: italic;
                  }
                  .word-content u {
                    text-decoration: underline;
                  }
                `}</style>
                <div
                  className="word-content prose prose-lg max-w-none"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    lineHeight: "1.6",
                    color: "#333",
                  }}
                  dangerouslySetInnerHTML={{ __html: wordContent }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty state for Word when no content */}
        {isWord && !loading && !error && !wordContent && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tài liệu trống
              </h3>
              <p className="text-gray-600">
                Tài liệu Word này không có nội dung để hiển thị.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
