import { axiosInstance } from "./index";

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice: string;
  features: string[];
  planType: "monthly" | "yearly" | "lifetime";
  amount: number;
  originalAmount: number;
  discountPercent: number;
}

export interface PremiumSubscription {
  id: string;
  planName: string;
  planType: "monthly" | "yearly" | "lifetime";
  amount: number;
  currency: string;
  startDate: string;
  endDate: string | null;
  remainingDays: number | null;
  features: string[];
  isCurrentlyActive: boolean;
}

export interface RevenueAnalytics {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  overallStats: {
    totalRevenue: number;
    totalSubscriptions: number;
    averageAmount: number;
    planBreakdown: Array<{
      planType: string;
      amount: number;
    }>;
  };
  revenueByPlan: Array<{
    _id: string;
    totalRevenue: number;
    totalSubscriptions: number;
    averageAmount: number;
  }>;
  revenueTimeline: Array<{
    _id: {
      planType: string;
      month: number;
      year: number;
    };
    totalRevenue: number;
    totalSubscriptions: number;
    averageAmount: number;
  }>;
  recentSubscriptions: Array<{
    _id: string;
    planName: string;
    planType: string;
    amount: number;
    purchaseDate: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
  }>;
}

class PremiumService {
  // Purchase a premium plan
  async purchasePlan(
    planId: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      console.log('🚀 Purchasing plan:', planId);
      console.log('🔗 Using axiosInstance:', axiosInstance);
      
      const response = await axiosInstance.post("/premium/purchase", {
        planId,
      });
      
      console.log('✅ API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API Error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      return {
        success: false,
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi mua gói premium",
      };
    }
  }

  // Get current user's subscription
  async getCurrentSubscription(): Promise<{
    success: boolean;
    data?: { subscription: PremiumSubscription };
    message?: string;
  }> {
    try {
      const response = await axiosInstance.get("/premium/current");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin gói đăng ký",
      };
    }
  }

  // Get subscription history
  async getSubscriptionHistory(
    page = 1,
    limit = 10
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await axiosInstance.get(
        `/premium/history?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy lịch sử đăng ký",
      };
    }
  }

  // Admin: Get revenue analytics
  async getRevenueAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<{ success: boolean; data?: RevenueAnalytics; message?: string }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axiosInstance.get(
        `/premium/analytics?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy thống kê doanh thu",
      };
    }
  }

  // Admin: Get all subscriptions
  async getAllSubscriptions(
    options: {
      page?: number;
      limit?: number;
      planType?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const params = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await axiosInstance.get(
        `/premium/all?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Không thể lấy danh sách đăng ký",
      };
    }
  }

  // Get available premium plans (static data for now)
  getAvailablePlans(): PremiumPlan[] {
    return [
      {
        id: "monthly",
        name: "Premium 1 Tháng",
        price: "99,000",
        period: " VNĐ/tháng",
        originalPrice: "149,000 VNĐ",
        planType: "monthly",
        amount: 99000,
        originalAmount: 149000,
        discountPercent: 34,
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
      },
      {
        id: "yearly",
        name: "Premium 1 Năm",
        price: "799,000",
        period: " VNĐ/năm",
        originalPrice: "1,188,000 VNĐ",
        planType: "yearly",
        amount: 799000,
        originalAmount: 1188000,
        discountPercent: 33,
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
      },
      {
        id: "lifetime",
        name: "Premium Trọn Đời",
        price: "2,999,000",
        period: " VNĐ (một lần)",
        originalPrice: "9,999,000 VNĐ",
        planType: "lifetime",
        amount: 2999000,
        originalAmount: 9999000,
        discountPercent: 70,
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
      },
    ];
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Calculate savings percentage
  calculateSavings(originalAmount: number, currentAmount: number): number {
    return Math.round(
      ((originalAmount - currentAmount) / originalAmount) * 100
    );
  }
}

export const premiumService = new PremiumService();
export default premiumService;
