"use client";

import React, { useState } from "react";
import {
  IoClose,
  IoStar,
  IoSparkles,
  IoRocket,
  IoShield,
  IoCheckmark,
  IoTrophy,
  IoDiamond,
  IoFlash,
  IoGift,
} from "react-icons/io5";
import premiumService from "@/services/premium.service";
import PremiumSuccessModal from "@/components/ui/PremiumSuccessModal";

console.log("Premium service imported:", premiumService);

interface PremiumSectionProps {
  user?: any;
  onUpgrade?: (planId: string) => void;
}

export default function PremiumSection({
  user,
  onUpgrade,
}: PremiumSectionProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedPlanName, setPurchasedPlanName] = useState("");

  // Don't show if user is already premium or dismissed
  if (user?.isPremium || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("premiumSectionDismissed", "true");
  };

  const handleUpgrade = async (planId: string) => {
    console.log('🎯 Button clicked with planId:', planId);
    console.log('🔄 isLoading:', isLoading);
    console.log('👤 user:', user);
    console.log('🛠️ premiumService available:', !!premiumService);
    console.log('🔧 premiumService methods:', Object.keys(premiumService || {}));
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!premiumService) {
        throw new Error('Premium service not available');
      }
      
      console.log('🛒 Calling API to purchase plan');
      // Always call API to purchase plan
      const result = await premiumService.purchasePlan(planId);
      
      console.log('📦 Purchase result:', result);

      if (result.success) {
        // Find the plan name
        const plan = plans.find((p) => p.id === planId);
        setPurchasedPlanName(plan?.name || "Premium");
        setShowSuccessModal(true);
        
        // Also call onUpgrade if provided (for additional logic)
        if (onUpgrade) {
          console.log('📞 Also calling onUpgrade prop for additional logic');
          onUpgrade(planId);
        }
      } else {
        // Show error message
        alert(result.message || "Có lỗi xảy ra khi mua gói premium");
      }
    } catch (error) {
      console.error("Error purchasing premium:", error);
      alert("Có lỗi xảy ra khi mua gói premium");
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: "monthly",
      name: "Premium 1 Tháng",
      price: "99,000",
      period: " VNĐ/tháng",
      originalPrice: "149,000 VNĐ",
      features: [
        "Lưu trữ đám mây không giới hạn",
        "Tìm kiếm thông minh AI",
        "Hỗ trợ ưu tiên 24/7",
        "Cộng tác nhóm không giới hạn",
        "Phân tích nâng cao",
        "Truy cập API đầy đủ",
        "Chữ ký số",
        "Sao lưu tự động",
        "Bảo mật cấp doanh nghiệp",
        "Tích hợp tùy chỉnh",
      ],
      icon: <IoRocket className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-cyan-500",
      badge: "Linh hoạt",
    },
    {
      id: "yearly",
      name: "Premium 1 Năm",
      price: "799,000",
      period: " VNĐ/năm",
      originalPrice: "1,188,000 VNĐ",
      features: [
        "Lưu trữ đám mây không giới hạn",
        "Tìm kiếm thông minh AI",
        "Hỗ trợ ưu tiên 24/7",
        "Cộng tác nhóm không giới hạn",
        "Phân tích nâng cao",
        "Truy cập API đầy đủ",
        "Chữ ký số",
        "Sao lưu tự động",
        "Bảo mật cấp doanh nghiệp",
        "Tích hợp tùy chỉnh",
      ],
      icon: <IoTrophy className="w-6 h-6 text-white" />,
      gradient: "from-purple-600 to-pink-600",
      badge: "Phổ biến nhất",
      popular: true,
    },
    {
      id: "lifetime",
      name: "Premium Trọn Đời",
      price: "2,999,000",
      period: " VNĐ (một lần)",
      originalPrice: "9,999,000 VNĐ",
      features: [
        "Lưu trữ đám mây không giới hạn",
        "Tìm kiếm thông minh AI",
        "Hỗ trợ ưu tiên 24/7",
        "Cộng tác nhóm không giới hạn",
        "Phân tích nâng cao",
        "Truy cập API đầy đủ",
        "Chữ ký số",
        "Sao lưu tự động",
        "Bảo mật cấp doanh nghiệp",
        "Tích hợp tùy chỉnh",
        "Cập nhật miễn phí trọn đời",
      ],
      icon: <IoDiamond className="w-6 h-6 text-white" />,
      gradient: "from-yellow-500 to-orange-500",
      badge: "Giá trị tốt nhất",
    },
  ];

  return (
    <div className="mb-12 relative">
      {/* Premium Header with Modern Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-400 rounded-full opacity-25 blur-xl animate-bounce"></div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 p-8 text-center">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-xl transition-all duration-300"
          >
            <IoClose className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-95 rounded-full text-orange-600 text-sm font-semibold mb-6 shadow-lg">
            <IoFlash className="w-4 h-4" />
            <span>Ưu đãi đặc biệt - Chỉ còn 24 giờ!</span>
            <IoGift className="w-4 h-4" />
          </div>

          <h2 className="text-4xl font-black text-white mb-4">
            Nâng cấp lên{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Premium
            </span>
          </h2>

          <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
            Trải nghiệm đầy đủ sức mạnh của hệ thống quản lý tài liệu thông minh
            với công nghệ AI tiên tiến
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2 text-purple-200">
              <IoStar className="w-4 h-4 text-yellow-400" />
              <span>4.9/5 từ hơn 25,000 người dùng</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-200">
              <IoShield className="w-4 h-4 text-green-400" />
              <span>Đảm bảo hoàn tiền 100% trong 30 ngày</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-200">
              <IoFlash className="w-4 h-4 text-blue-400" />
              <span>Kích hoạt ngay lập tức</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards with Modern Design */}
      <div className="grid lg:grid-cols-3 gap-6 mt-16">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex flex-col ${
              plan.popular
                ? "ring-4 ring-purple-500 ring-opacity-50 scale-105"
                : ""
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold shadow-lg">
                  {plan.badge}
                </div>
              </div>
            )}

            <div className="p-8 flex flex-col h-full">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center shadow-lg`}
                >
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div
                  className={`inline-block px-3 py-1 bg-gradient-to-r ${plan.gradient} text-white rounded-full text-sm font-semibold`}
                >
                  {plan.badge}
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="text-sm text-gray-500 line-through mb-2">
                  {plan.originalPrice}
                </div>
                <div className="flex items-baseline justify-center space-x-2 mb-2">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-600">{plan.period}</span>
                </div>
                <div className="text-sm text-green-600 font-semibold">
                  {plan.id === "monthly"
                    ? "Tiết kiệm 34%"
                    : plan.id === "yearly"
                    ? "Tiết kiệm 33%"
                    : "Tiết kiệm 70%"}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8 flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <IoCheckmark className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button - Always at bottom */}
              <div className="mt-auto">
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 bg-gradient-to-r ${plan.gradient} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <IoRocket className="w-5 h-5 group-hover:animate-bounce" />
                      <span>Chọn {plan.name}</span>
                      <IoSparkles className="w-5 h-5 group-hover:animate-spin" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      <PremiumSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        planName={purchasedPlanName}
      />
    </div>
  );
}
