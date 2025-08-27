"use client";

import React, { useState } from "react";
import {
  IoStar,
  IoClose,
  IoGift,
  IoTrendingUp,
  IoShield,
  IoTime,
} from "react-icons/io5";
import PremiumCard from "./PremiumCard";

interface PremiumSectionProps {
  user?: any;
  onUpgrade?: (planId: string) => void;
}

export default function PremiumSection({
  user,
  onUpgrade,
}: PremiumSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if user is already premium
  if (user?.isPremium || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    // You might want to save this preference in localStorage
    localStorage.setItem("premiumSectionDismissed", "true");
  };

  const handleUpgrade = (planId: string) => {
    if (onUpgrade) {
      onUpgrade(planId);
    } else {
      // Default upgrade action
      window.open(`/premium/upgrade?plan=${planId}`, "_blank");
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <IoStar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">🎉 Ưu đãi đặc biệt Premium!</h3>
              <p className="text-yellow-100">
                Giảm 50% cho 1000 người đăng ký đầu tiên
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-6 py-2 bg-white text-orange-500 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Xem chi tiết
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-6 px-8 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <IoGift className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                🔥 Ưu đãi Premium giới hạn!
              </h2>
              <p className="text-yellow-100 text-lg">
                Chỉ còn 72 giờ - Giảm 50% gói Premium
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white border-x-2 border-yellow-200 px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <IoTrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã có</p>
              <p className="font-bold text-lg text-gray-900">12,547 người</p>
              <p className="text-xs text-gray-500">nâng cấp Premium</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <IoShield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiết kiệm</p>
              <p className="font-bold text-lg text-gray-900">99,000₫</p>
              <p className="text-xs text-gray-500">mỗi tháng</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <IoTime className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Còn lại</p>
              <p className="font-bold text-lg text-gray-900">147 suất</p>
              <p className="text-xs text-gray-500">ưu đãi 50%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Card */}
      <div className="bg-white border-x-2 border-b-2 border-yellow-200 rounded-b-2xl p-8">
        <div className="w-full">
          <PremiumCard onUpgrade={handleUpgrade} />
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-6">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Được tin tưởng bởi hàng nghìn doanh nghiệp
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl">
            <div className="text-2xl font-bold text-blue-600">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Hỗ trợ</div>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="text-2xl font-bold text-purple-600">100GB</div>
            <div className="text-sm text-gray-600">Lưu trữ</div>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="text-2xl font-bold text-orange-600">30 ngày</div>
            <div className="text-sm text-gray-600">Hoàn tiền</div>
          </div>
        </div>
      </div>
    </div>
  );
}
