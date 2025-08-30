"use client";

import React, { useState, useEffect } from "react";
import {
  IoTrendingUp,
  IoCard,
  IoTime,
  IoPeople,
  IoStatsChart,
  IoCalendar,
  IoDownload,
  IoRefresh,
} from "react-icons/io5";
import {
  premiumService,
  type RevenueAnalytics,
} from "@/services/premium.service";

export default function PremiumAnalyticsPage() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const result = await premiumService.getRevenueAnalytics(
        dateRange.startDate,
        dateRange.endDate
      );
      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        console.error("Failed to fetch analytics:", result.message);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getPlanTypeLabel = (planType: string) => {
    const labels = {
      monthly: "Tháng",
      yearly: "Năm",
      lifetime: "Trọn đời",
    };
    return labels[planType as keyof typeof labels] || planType;
  };

  const getPlanTypeColor = (planType: string) => {
    const colors = {
      monthly: "from-blue-500 to-cyan-500",
      yearly: "from-purple-600 to-pink-600",
      lifetime: "from-yellow-500 to-orange-500",
    };
    return (
      colors[planType as keyof typeof colors] || "from-gray-500 to-gray-600"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                📊 Thống Kê Doanh Thu Premium
              </h1>
              <p className="text-gray-600">
                Theo dõi hiệu suất bán hàng và xu hướng người dùng Premium
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Range Selector */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={fetchAnalytics}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <IoRefresh className="w-4 h-4" />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {analytics && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <IoTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(analytics.overallStats.totalRevenue)}
                </h3>
                <p className="text-gray-600 text-sm">Tổng doanh thu</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <IoPeople className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {analytics.overallStats.totalSubscriptions.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">Số lượng đăng ký</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <IoCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(analytics.overallStats.averageAmount)}
                </h3>
                <p className="text-gray-600 text-sm">Giá trị trung bình</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <IoStatsChart className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {analytics.revenueByPlan.length}
                </h3>
                <p className="text-gray-600 text-sm">Loại gói khác nhau</p>
              </div>
            </div>

            {/* Revenue by Plan Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Doanh thu theo loại gói
                </h2>
                <div className="space-y-4">
                  {analytics.revenueByPlan.map((plan) => (
                    <div
                      key={plan._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPlanTypeColor(
                            plan._id
                          )} flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-sm">
                            {plan._id.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Gói {getPlanTypeLabel(plan._id)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {plan.totalSubscriptions} đăng ký
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(plan.totalRevenue)}
                        </p>
                        <p className="text-sm text-gray-600">
                          TB: {formatCurrency(plan.averageAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Subscriptions */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Đăng ký gần đây
                </h2>
                <div className="space-y-4">
                  {analytics.recentSubscriptions
                    .slice(0, 5)
                    .map((subscription) => (
                      <div
                        key={subscription._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {subscription.userId.name ||
                              subscription.userId.email}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {subscription.planName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(subscription.purchaseDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(subscription.amount)}
                          </p>
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPlanTypeColor(
                              subscription.planType
                            )} text-white`}
                          >
                            {getPlanTypeLabel(subscription.planType)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Revenue Timeline */}
            {analytics.revenueTimeline.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Biểu đồ doanh thu theo thời gian
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analytics.revenueTimeline.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {item._id.month}/{item._id.year}
                        </h3>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPlanTypeColor(
                            item._id.planType
                          )} text-white`}
                        >
                          {getPlanTypeLabel(item._id.planType)}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600 mb-1">
                        {formatCurrency(item.totalRevenue)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.totalSubscriptions} đăng ký • TB:{" "}
                        {formatCurrency(item.averageAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
