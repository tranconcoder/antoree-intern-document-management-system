"use client";

import React from "react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

interface PremiumSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  onGoToProfile?: () => void;
}

export default function PremiumSuccessModal({
  isOpen,
  onClose,
  planName,
  onGoToProfile,
}: PremiumSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform scale-100 transition-all duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoClose className="w-5 h-5" />
        </button>

        {/* Success Animation */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <IoCheckmarkCircle className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Chúc mừng!
          </h2>

          <p className="text-gray-600 mb-4">
            Bạn đã nâng cấp thành công lên{" "}
            <span className="font-semibold text-purple-600">{planName}</span>
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">
              ✨ Những tính năng mới đã mở khóa:
            </h3>
            <ul className="text-sm text-purple-800 space-y-1 text-left">
              <li>• Lưu trữ đám mây không giới hạn</li>
              <li>• Tìm kiếm thông minh AI</li>
              <li>• Hỗ trợ ưu tiên 24/7</li>
              <li>• Cộng tác nhóm không giới hạn</li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              window.location.reload();
            }}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Bắt đầu sử dụng
          </button>

          {onGoToProfile && (
            <button
              onClick={() => {
                onGoToProfile();
                onClose();
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Xem hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
