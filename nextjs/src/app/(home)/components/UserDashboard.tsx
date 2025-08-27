"use client";

import Link from "next/link";
import { IoDocumentText, IoCloudUpload, IoAnalytics } from "react-icons/io5";
import PremiumSection from "./PremiumSection";

interface UserDashboardProps {
  user: {
    user_firstName?: string;
    isPremium?: boolean;
  } | null;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const handlePremiumUpgrade = (planId: string) => {
    // Handle premium upgrade logic
    console.log("Premium upgrade clicked for plan:", planId);
    // You can add redirect to payment page or open modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng trở lại, {user?.user_firstName}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Quản lý tài liệu của bạn một cách hiệu quả
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Link
              href="/documents"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <IoDocumentText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tài liệu của tôi</h3>
              <p className="text-gray-600">Xem và quản lý tất cả tài liệu</p>
            </Link>

            <Link
              href="/documents/upload"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <IoCloudUpload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tải lên</h3>
              <p className="text-gray-600">Thêm tài liệu mới</p>
            </Link>

            <Link
              href="/analytics"
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <IoAnalytics className="w-12 h-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thống kê</h3>
              <p className="text-gray-600">Xem báo cáo và phân tích</p>
            </Link>
          </div>
        </div>

        {/* Premium Section - Moved below the quick actions */}
        <div className="mt-16">
          <PremiumSection user={user} onUpgrade={handlePremiumUpgrade} />
        </div>
      </div>
    </div>
  );
}
