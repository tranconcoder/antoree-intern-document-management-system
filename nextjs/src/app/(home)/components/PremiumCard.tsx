"use client";

import React from "react";
import {
  IoStar,
  IoCheckmarkCircle,
  IoCloudUpload,
  IoShield,
  IoSpeedometer,
  IoTrophy,
  IoArrowForward,
  IoDiamond,
  IoRocket,
  IoFlash,
} from "react-icons/io5";

interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  period: string;
  icon: React.ReactNode;
  color: {
    from: string;
    to: string;
    border: string;
    bg: string;
  };
  features: string[];
  isPopular?: boolean;
}

const premiumPlans: PremiumPlan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Dành cho người dùng cá nhân",
    price: 49000,
    originalPrice: 99000,
    discount: 50,
    period: "tháng",
    icon: <IoRocket className="w-8 h-8" />,
    color: {
      from: "from-blue-400",
      to: "to-blue-600",
      border: "border-blue-200",
      bg: "from-blue-50 to-blue-100",
    },
    features: [
      "Upload tối đa 50 files/tháng",
      "Lưu trữ 10GB",
      "Tìm kiếm cơ bản",
      "Export PDF",
      "Hỗ trợ email",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Dành cho doanh nghiệp lớn",
    price: 199000,
    originalPrice: 399000,
    discount: 50,
    period: "tháng",
    icon: <IoDiamond className="w-8 h-8" />,
    color: {
      from: "from-purple-400",
      to: "to-pink-600",
      border: "border-purple-200",
      bg: "from-purple-50 to-pink-50",
    },
    features: [
      "Tất cả tính năng Pro",
      "Lưu trữ không giới hạn",
      "API access đầy đủ",
      "White-label solution",
      "Analytics nâng cao",
      "Quản lý team",
      "Hỗ trợ dedicated manager",
      "SLA 99.99%",
    ],
    isPopular: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Dành cho doanh nghiệp nhỏ",
    price: 99000,
    originalPrice: 199000,
    discount: 50,
    period: "tháng",
    icon: <IoStar className="w-8 h-8" />,
    color: {
      from: "from-yellow-400",
      to: "to-orange-500",
      border: "border-yellow-200",
      bg: "from-yellow-50 to-orange-50",
    },
    features: [
      "Upload không giới hạn",
      "Lưu trữ 100GB",
      "AI tìm kiếm thông minh",
      "Export PDF/Word/Excel",
      "Chia sẻ bảo mật",
      "Backup tự động",
      "Hỗ trợ chat 24/7",
    ],
  },
];

interface PremiumCardProps {
  isCompact?: boolean;
  className?: string;
  onUpgrade?: (planId: string) => void;
}

export default function PremiumCard({
  isCompact = false,
  className = "",
  onUpgrade,
}: PremiumCardProps) {
  const handleUpgrade = (planId: string) => {
    if (onUpgrade) {
      onUpgrade(planId);
    } else {
      // Default upgrade action
      window.open(`/premium/upgrade?plan=${planId}`, "_blank");
    }
  };

  if (isCompact) {
    return (
      <div
        className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <IoStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Nâng cấp Premium</h3>
              <p className="text-sm text-gray-600">3 gói để lựa chọn</p>
            </div>
          </div>
          <button
            onClick={() => handleUpgrade("pro")}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 font-medium"
          >
            <span>Xem gói</span>
            <IoArrowForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Chọn gói Premium phù hợp
        </h2>
        <p className="text-lg text-gray-600">
          Nâng cao trải nghiệm quản lý tài liệu của bạn
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
        {premiumPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gradient-to-br ${plan.color.bg} border-2 ${
              plan.color.border
            } rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 min-h-[600px] flex flex-col ${
              plan.isPopular
                ? "lg:scale-105 ring-4 ring-yellow-200 lg:-mt-4"
                : ""
            }`}
          >
            {/* Popular badge */}
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  <IoFlash className="w-4 h-4 inline mr-1" />
                  Phổ biến nhất
                </div>
              </div>
            )}

            {/* Plan header */}
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${plan.color.from} ${plan.color.to} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white`}
              >
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 text-lg">{plan.description}</p>
            </div>

            {/* Pricing */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price.toLocaleString()}₫
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {plan.originalPrice.toLocaleString()}₫
                </span>
              </div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-2">
                Giảm {plan.discount}% - Ưu đãi có hạn
              </div>
              <p className="text-sm text-gray-500">/ {plan.period}</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <IoCheckmarkCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-auto">
              <button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-4 bg-gradient-to-r ${plan.color.from} ${plan.color.to} text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
              >
                <IoStar className="w-5 h-5" />
                <span>Chọn gói {plan.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
          <IoShield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            Đảm bảo hoàn tiền 100% trong 30 ngày đầu
          </span>
        </div>
      </div>
    </div>
  );
}
