"use client";

import React from "react";
import { IoDocument, IoCheckmarkCircle, IoEye, IoTrash } from "react-icons/io5";
import { getFileCategory } from "@/enums/fileType.enum";
import {
  formatFileSize,
  formatUploadSpeed,
  formatTimeRemaining,
} from "@/configs/upload.config";

interface FileUploadItemProps {
  id: string;
  file: File;
  path: string;
  previewUrl?: string;
  error?: string;
  progress?: {
    fileId: string;
    progress: number;
    status: "pending" | "uploading" | "completed" | "error";
    error?: string;
    loaded?: number;
    total?: number;
    speed?: number;
    timeRemaining?: number;
  };
  uploading: boolean;
  onRemove: (fileId: string) => void;
  onPreview?: (previewUrl: string) => void;
}

export default function FileUploadItem({
  id,
  file,
  path,
  previewUrl,
  error,
  progress,
  uploading,
  onRemove,
  onPreview,
}: FileUploadItemProps) {
  const getItemStyle = () => {
    if (error) {
      return "border-red-300 bg-red-50";
    }
    if (progress?.status === "completed") {
      return "border-green-300 bg-green-50";
    }
    if (progress?.status === "uploading") {
      return "border-blue-300 bg-blue-50";
    }
    return "border-gray-200 bg-gray-50";
  };

  const getProgressBarColor = () => {
    switch (progress?.status) {
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-600";
    }
  };

  const getStatusText = () => {
    switch (progress?.status) {
      case "completed":
        return (
          <span className="text-xs text-green-600 font-medium">
            ✓ Hoàn thành
          </span>
        );
      case "error":
        return <span className="text-xs text-red-600 font-medium">✗ Lỗi</span>;
      case "uploading":
        return (
          <span className="text-xs text-blue-600 font-medium">
            🔄 Đang tải...
          </span>
        );
      default:
        return null;
    }
  };

  const handlePreview = () => {
    if (previewUrl && onPreview) {
      onPreview(previewUrl);
    } else if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-xl ${getItemStyle()}`}
    >
      <div className="flex items-center space-x-4 flex-1">
        {/* File Icon */}
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <IoDocument className="w-6 h-6 text-blue-600" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">
            {getFileCategory(file.type)} • {formatFileSize(file.size)} • ID:{" "}
            {path.slice(-12)}
          </p>

          {/* Error Message */}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

          {/* Progress Bar */}
          {progress && uploading && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                  style={{
                    width: `${progress.progress}%`,
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-1">
                {/* Progress Info Left */}
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500">
                    {progress.progress}% hoàn thành
                  </p>
                  {getStatusText()}
                </div>

                {/* Speed and Time Remaining */}
                {progress.status === "uploading" && (
                  <div className="text-xs text-gray-500 flex space-x-2">
                    {progress.speed && progress.speed > 0 && (
                      <span>{formatUploadSpeed(progress.speed)}</span>
                    )}
                    {progress.timeRemaining && progress.timeRemaining > 0 && (
                      <>
                        <span>•</span>
                        <span>
                          {formatTimeRemaining(progress.timeRemaining)} còn lại
                        </span>
                      </>
                    )}
                  </div>
                )}

                {/* Size Info */}
                {progress.loaded && progress.total && (
                  <div className="text-xs text-gray-500">
                    {formatFileSize(progress.loaded)} /{" "}
                    {formatFileSize(progress.total)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Completed Checkmark */}
        {progress?.status === "completed" && (
          <IoCheckmarkCircle className="w-6 h-6 text-green-500" />
        )}

        {/* Preview Button */}
        {previewUrl && (
          <button
            type="button"
            onClick={handlePreview}
            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="Xem trước"
          >
            <IoEye className="w-5 h-5" />
          </button>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(id)}
          disabled={uploading}
          className="p-1 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
          title="Xóa file"
        >
          <IoTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
