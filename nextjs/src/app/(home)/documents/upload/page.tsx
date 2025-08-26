"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import {
  IoCloudUpload,
  IoCheckmarkCircle,
  IoClose,
  IoLockClosed,
  IoGlobe,
  IoAdd,
  IoWarning,
} from "react-icons/io5";
import { Input, Button } from "@/components/ui";
import { getAllFileTypes, isSupportedFileType } from "@/enums/fileType.enum";
import { UPLOAD_CONFIG, formatFileSize } from "@/configs/upload.config";
import {
  documentUploadValidationSchema,
  type DocumentUploadFormValues,
} from "@/app/validator/yup/documentUpload.yup";
import DocumentUploadService, {
  type AllFilesProgressEvent,
  type FileProgressInfo,
} from "@/services/upload.service";
import { FileUploadItem } from "@/components/upload";

interface SelectedFile {
  id: string;
  file: File;
  path: string; // File path for duplicate checking
  previewUrl?: string;
  error?: string;
}

interface UploadProgress {
  fileId: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  loaded?: number;
  total?: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [selectedPreviewAvatar, setSelectedPreviewAvatar] = useState<
    string | null
  >(null);
  const [uploadStartTime, setUploadStartTime] = useState<number | null>(null);

  const initialValues: DocumentUploadFormValues = {
    title: "",
    description: "",
    isPremium: false,
    isPublic: false,
  };

  // Generate unique ID for files
  const generateFileId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Generate file path identifier for duplicate checking
  const generateFilePath = (file: File): string => {
    // Use file name + size + lastModified as unique identifier
    return `${file.name}_${file.size}_${file.lastModified}`;
  };

  // Check if file already exists
  const isFileAlreadySelected = useCallback(
    (file: File): boolean => {
      const filePath = generateFilePath(file);
      return selectedFiles.some(
        (selectedFile) => selectedFile.path === filePath
      );
    },
    [selectedFiles]
  );

  // Validate single file
  const validateFile = useCallback(
    (file: File): string | null => {
      if (isFileAlreadySelected(file)) {
        return "File này đã được chọn rồi.";
      }
      if (!isSupportedFileType(file.type)) {
        return "Loại file không được hỗ trợ. Chỉ chấp nhận PDF, Word, Excel, PowerPoint.";
      }
      if (file.size < UPLOAD_CONFIG.MIN_FILE_SIZE) {
        return `File quá nhỏ. Kích thước tối thiểu là ${formatFileSize(
          UPLOAD_CONFIG.MIN_FILE_SIZE
        )}.`;
      }
      if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
        return `File quá lớn. Kích thước tối đa là ${formatFileSize(
          UPLOAD_CONFIG.MAX_FILE_SIZE
        )}.`;
      }
      return null;
    },
    [isFileAlreadySelected]
  );

  // Handle file selection/addition
  const handleFileSelect = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      // Check total file count
      if (selectedFiles.length + files.length > UPLOAD_CONFIG.MAX_FILES) {
        setGlobalError(
          `Chỉ có thể tải lên tối đa ${UPLOAD_CONFIG.MAX_FILES} file.`
        );
        return;
      }

      const newFiles: SelectedFile[] = [];
      const duplicateFiles: string[] = [];

      files.forEach((file) => {
        const error = validateFile(file);

        if (error && error.includes("đã được chọn")) {
          duplicateFiles.push(file.name);
          return;
        }

        const fileId = generateFileId();

        const selectedFile: SelectedFile = {
          id: fileId,
          file,
          path: generateFilePath(file),
          error: error || undefined,
        };

        // Generate preview for certain file types
        if (
          !error &&
          (file.type === "application/pdf" || file.type.startsWith("image/"))
        ) {
          selectedFile.previewUrl = URL.createObjectURL(file);
        }

        newFiles.push(selectedFile);
      });

      if (duplicateFiles.length > 0) {
        setGlobalError(`File(s) đã được chọn: ${duplicateFiles.join(", ")}`);
      } else {
        setGlobalError(null);
      }

      if (newFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [selectedFiles, validateFile]
  ); // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileSelect(files);
      }
      // Reset input value to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFileSelect]
  );

  // Remove single file
  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });

    setUploadProgress((prev) => prev.filter((p) => p.fileId !== fileId));
  }, []);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    selectedFiles.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setSelectedFiles([]);
    setUploadProgress([]);
    setGlobalError(null);
  }, [selectedFiles]);

  // Calculate total size
  const totalSize = selectedFiles.reduce(
    (total, item) => total + item.file.size,
    0
  );
  const validFiles = selectedFiles.filter((item) => !item.error);
  const hasErrors = selectedFiles.some((item) => item.error);

  // Get image files that can be used as preview avatar
  const imageFiles = validFiles.filter((item) =>
    item.file.type.startsWith("image/")
  );

  // Reset selected avatar if the selected file is removed
  const resetAvatarIfNeeded = useCallback(() => {
    if (
      selectedPreviewAvatar &&
      !imageFiles.some((img) => img.id === selectedPreviewAvatar)
    ) {
      setSelectedPreviewAvatar(null);
    }
  }, [selectedPreviewAvatar, imageFiles]);

  // Auto-reset avatar when files change
  useEffect(() => {
    resetAvatarIfNeeded();
  }, [resetAvatarIfNeeded]);

  // Handle form submission
  const handleSubmit = async (values: DocumentUploadFormValues) => {
    if (validFiles.length === 0) {
      setGlobalError("Vui lòng chọn ít nhất một file hợp lệ để upload");
      return;
    }

    setUploading(true);
    setGlobalError(null);
    setUploadStartTime(Date.now());

    // Initialize upload progress
    const initialProgress: UploadProgress[] = validFiles.map((item) => ({
      fileId: item.id,
      progress: 0,
      status: "pending",
      total: item.file.size,
      loaded: 0,
    }));
    setUploadProgress(initialProgress);

    try {
      // Prepare upload data
      const uploadData = {
        title: values.title,
        description: values.description,
        isPremium: values.isPremium,
        isPublic: values.isPublic,
        files: validFiles.map((item) => item.file),
        fileNames: validFiles.map((item) => item.file.name),
        fileSizes: validFiles.map((item) => item.file.size),
        contentTypes: validFiles.map((item) => item.file.type),
        previewAvatar: selectedPreviewAvatar
          ? imageFiles.find((img) => img.id === selectedPreviewAvatar)?.file
          : undefined,
      };

      console.log("=== Frontend Upload Data ===");
      console.log("Title:", uploadData.title);
      console.log("Description:", uploadData.description);
      console.log("FileNames:", uploadData.fileNames);
      console.log("FileSizes:", uploadData.fileSizes);
      console.log("ContentTypes:", uploadData.contentTypes);
      console.log("Files count:", uploadData.files.length);

      // Upload with throttled progress tracking (updates every second)
      const result =
        await DocumentUploadService.uploadDocumentWithThrottledProgress(
          uploadData,
          // All files progress callback (called every second)
          (progressData: AllFilesProgressEvent) => {
            console.log("Progress update received:", {
              overallProgress: progressData.overallProgress,
              filesCount: progressData.files.length,
              timestamp: new Date().toISOString(),
            });

            // Update upload progress state with all files data at once
            setUploadProgress((prev) => {
              const newProgress = prev.map((p) => {
                // Find corresponding file in progress data
                const fileIndex = validFiles.findIndex(
                  (f) => f.id === p.fileId
                );
                const fileProgress = progressData.files[fileIndex];

                if (fileProgress) {
                  console.log(
                    `Updating file ${fileIndex} (${validFiles[fileIndex]?.file.name}):`,
                    {
                      oldProgress: p.progress,
                      newProgress: fileProgress.progress,
                      status: fileProgress.status,
                    }
                  );

                  return {
                    ...p,
                    progress: fileProgress.progress,
                    status: fileProgress.status,
                    loaded: fileProgress.loaded,
                    total: fileProgress.total,
                    speed: fileProgress.speed,
                    timeRemaining: fileProgress.timeRemaining,
                    error:
                      fileProgress.status === "error"
                        ? "Upload failed"
                        : undefined,
                  };
                }
                return p;
              });

              return newProgress;
            });
          }
        );

      console.log("Upload successful:", result);

      // Mark all files as completed
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: "completed", progress: 100 }))
      );

      // Redirect to documents list after a short delay to show completion
      setTimeout(() => {
        router.push("/documents?uploaded=true");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as any;
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Upload failed";
      }

      setGlobalError(errorMessage);

      // Mark all as error
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: "error", error: errorMessage }))
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tải lên tài liệu
          </h1>
          <p className="text-gray-600">
            Thêm nhiều tài liệu cùng lúc vào hệ thống quản lý của bạn
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={documentUploadValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-8">
                {/* File Upload Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Chọn tài liệu * (Tối đa {UPLOAD_CONFIG.MAX_FILES} files)
                    </label>
                    {selectedFiles.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFiles}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>

                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : selectedFiles.length > 0
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={getAllFileTypes().join(",")}
                      onChange={handleFileInputChange}
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <IoCloudUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Kéo thả files hoặc click để chọn
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Hỗ trợ PDF, Word, Excel, PowerPoint (tối đa{" "}
                      {formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)} mỗi file)
                    </p>
                    <div className="flex justify-center">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Chọn files
                      </span>
                    </div>
                  </div>

                  {globalError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <IoWarning className="w-4 h-4" />
                      <span>{globalError}</span>
                    </div>
                  )}
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Files đã chọn ({selectedFiles.length}/
                        {UPLOAD_CONFIG.MAX_FILES})
                      </h3>
                      <div className="text-sm text-gray-500">
                        Tổng dung lượng: {formatFileSize(totalSize)}
                      </div>
                    </div>

                    {/* Overall Upload Progress */}
                    {uploading && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">
                            Đang tải lên {validFiles.length} files...
                          </span>
                          <span className="text-sm text-blue-700">
                            {
                              uploadProgress.filter(
                                (p) => p.status === "completed"
                              ).length
                            }{" "}
                            / {validFiles.length} hoàn thành
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.round(
                                (uploadProgress.filter(
                                  (p) => p.status === "completed"
                                ).length /
                                  validFiles.length) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedFiles.map((item) => {
                        const progress = uploadProgress.find(
                          (p) => p.fileId === item.id
                        );
                        return (
                          <FileUploadItem
                            key={item.id}
                            id={item.id}
                            file={item.file}
                            path={item.path}
                            previewUrl={item.previewUrl}
                            error={item.error}
                            progress={progress}
                            uploading={uploading}
                            onRemove={removeFile}
                          />
                        );
                      })}
                    </div>

                    {hasErrors && (
                      <div className="flex items-center space-x-2 text-orange-600 text-sm bg-orange-50 p-3 rounded-lg">
                        <IoWarning className="w-4 h-4" />
                        <span>Một số files có lỗi và sẽ không được upload</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Document Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Input id="title" name="title" label="Tiêu đề tài liệu *" />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả tài liệu *
                      </label>
                      <textarea
                        name="description"
                        value={values.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFieldValue("description", e.target.value)
                        }
                        placeholder="Nhập mô tả chi tiết về nhóm tài liệu..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      {errors.description && touched.description && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Cài đặt tài liệu
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={values.isPremium}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue("isPremium", e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <IoLockClosed className="w-5 h-5 text-yellow-500" />
                        <div>
                          <label
                            htmlFor="isPremium"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Tài liệu Premium
                          </label>
                          <p className="text-sm text-gray-500">
                            Chỉ thành viên premium mới xem được
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={values.isPublic}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFieldValue("isPublic", e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <IoGlobe className="w-5 h-5 text-green-500" />
                        <div>
                          <label
                            htmlFor="isPublic"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Công khai
                          </label>
                          <p className="text-sm text-gray-500">
                            Mọi người đều có thể xem
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Avatar Selection */}
                {imageFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Chọn ảnh đại diện (tùy chọn)
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageFiles.map((imageFile) => (
                        <div
                          key={imageFile.id}
                          className={`relative p-2 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPreviewAvatar === imageFile.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedPreviewAvatar(
                              selectedPreviewAvatar === imageFile.id
                                ? null
                                : imageFile.id
                            );
                          }}
                        >
                          {imageFile.previewUrl && (
                            <img
                              src={imageFile.previewUrl}
                              alt={imageFile.file.name}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          )}
                          <p className="text-xs text-gray-600 mt-2 truncate">
                            {imageFile.file.name}
                          </p>
                          {selectedPreviewAvatar === imageFile.id && (
                            <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <IoCheckmarkCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>

                  <Button
                    type="submit"
                    disabled={validFiles.length === 0 || uploading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {uploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang tải lên {validFiles.length} files...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <IoCloudUpload className="w-5 h-5" />
                        <span>Tải lên {validFiles.length} tài liệu</span>
                      </div>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
