import type { Request, Response } from "express";
import { Types } from "mongoose";
import PremiumSubscription, {
  type IPremiumSubscription,
} from "../models/premiumSubscription.model";
import User from "../models/user.model";

export class PremiumController {
  // Purchase Premium Plan
  static async purchasePlan(req: Request, res: Response) {
    try {
      const { planId } = req.body;
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login first.",
        });
      }

      if (!planId || !["monthly", "yearly", "lifetime"].includes(planId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan ID. Must be: monthly, yearly, or lifetime.",
        });
      }

      // Check if user already has an active subscription
      const existingSubscription =
        await PremiumSubscription.getActiveSubscription(
          new Types.ObjectId(userId)
        );

      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          message: "You already have an active premium subscription.",
          data: {
            currentPlan: existingSubscription.planName,
            endDate: existingSubscription.endDate,
          },
        });
      }

      // Define plan details
      const planDetails = {
        monthly: {
          name: "Premium 1 Tháng",
          amount: 99000,
          originalAmount: 149000,
          discountPercent: 34,
          durationDays: 30,
        },
        yearly: {
          name: "Premium 1 Năm",
          amount: 799000,
          originalAmount: 1188000,
          discountPercent: 33,
          durationDays: 365,
        },
        lifetime: {
          name: "Premium Trọn Đời",
          amount: 2999000,
          originalAmount: 9999000,
          discountPercent: 70,
          durationDays: null, // lifetime
        },
      };

      const plan = planDetails[planId as keyof typeof planDetails];

      // Calculate end date
      const startDate = new Date();
      const endDate = plan.durationDays
        ? new Date(
            startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
          )
        : null;

      // Premium features
      const features = [
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
      ];

      if (planId === "lifetime") {
        features.push("Cập nhật miễn phí trọn đời");
      }

      // Create subscription record
      const subscription = new PremiumSubscription({
        userId: new Types.ObjectId(userId),
        planId,
        planName: plan.name,
        planType: planId,
        amount: plan.amount,
        originalAmount: plan.originalAmount,
        discountPercent: plan.discountPercent,
        currency: "VND",
        status: "active",
        startDate,
        endDate,
        purchaseDate: new Date(),
        features,
        metadata: {
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get("User-Agent"),
          source: "web_direct",
        },
      });

      await subscription.save();

      // Update user premium status
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
        premiumPlan: planId,
        premiumStartDate: startDate,
        premiumEndDate: endDate,
      });

      res.status(201).json({
        success: true,
        message: "Premium plan purchased successfully!",
        data: {
          subscription: {
            id: subscription._id,
            planName: subscription.planName,
            planType: subscription.planType,
            amount: subscription.amount,
            currency: subscription.currency,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            features: subscription.features,
          },
        },
      });
    } catch (error) {
      console.error("Error purchasing premium plan:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get user's current subscription
  static async getCurrentSubscription(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const subscription = await PremiumSubscription.getActiveSubscription(
        new Types.ObjectId(userId)
      );

      if (!subscription) {
        return res.status(404).json({
          success: false,
          message: "No active subscription found",
        });
      }

      res.status(200).json({
        success: true,
        data: {
          subscription: {
            id: subscription._id,
            planName: subscription.planName,
            planType: subscription.planType,
            amount: subscription.amount,
            currency: subscription.currency,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            remainingDays: subscription.getRemainingDays(),
            features: subscription.features,
            isCurrentlyActive: subscription.isCurrentlyActive,
          },
        },
      });
    } catch (error) {
      console.error("Error getting current subscription:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Get subscription history
  static async getSubscriptionHistory(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const subscriptions = await PremiumSubscription.find({
        userId: new Types.ObjectId(userId),
      })
        .sort({ purchaseDate: -1 })
        .limit(Number(limit) * Number(page))
        .skip((Number(page) - 1) * Number(limit))
        .lean();

      const total = await PremiumSubscription.countDocuments({
        userId: new Types.ObjectId(userId),
      });

      res.status(200).json({
        success: true,
        data: {
          subscriptions,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
            itemsPerPage: Number(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting subscription history:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Admin: Get revenue analytics
  static async getRevenueAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate, groupBy = "month" } = req.query;

      const start = startDate
        ? new Date(startDate as string)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      // Overall statistics
      const overallStats = await PremiumSubscription.aggregate([
        {
          $match: {
            purchaseDate: { $gte: start, $lte: end },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalSubscriptions: { $sum: 1 },
            averageAmount: { $avg: "$amount" },
            planBreakdown: {
              $push: {
                planType: "$planType",
                amount: "$amount",
              },
            },
          },
        },
      ]);

      // Revenue by plan type
      const revenueByPlan = await PremiumSubscription.aggregate([
        {
          $match: {
            purchaseDate: { $gte: start, $lte: end },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: "$planType",
            totalRevenue: { $sum: "$amount" },
            totalSubscriptions: { $sum: 1 },
            averageAmount: { $avg: "$amount" },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ]);

      // Revenue timeline
      const revenueTimeline = await PremiumSubscription.getRevenueAnalytics(
        start,
        end
      );

      // Recent subscriptions
      const recentSubscriptions = await PremiumSubscription.find({
        purchaseDate: { $gte: start, $lte: end },
      })
        .populate("userId", "name email")
        .sort({ purchaseDate: -1 })
        .limit(10)
        .lean();

      res.status(200).json({
        success: true,
        data: {
          dateRange: { startDate: start, endDate: end },
          overallStats: overallStats[0] || {
            totalRevenue: 0,
            totalSubscriptions: 0,
            averageAmount: 0,
            planBreakdown: [],
          },
          revenueByPlan,
          revenueTimeline,
          recentSubscriptions,
        },
      });
    } catch (error) {
      console.error("Error getting revenue analytics:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Admin: Get all subscriptions with filters
  static async getAllSubscriptions(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        planType,
        status,
        startDate,
        endDate,
      } = req.query;

      const filter: any = {};

      if (planType) filter.planType = planType;
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.purchaseDate = {};
        if (startDate) filter.purchaseDate.$gte = new Date(startDate as string);
        if (endDate) filter.purchaseDate.$lte = new Date(endDate as string);
      }

      const subscriptions = await PremiumSubscription.find(filter)
        .populate("userId", "name email")
        .sort({ purchaseDate: -1 })
        .limit(Number(limit) * Number(page))
        .skip((Number(page) - 1) * Number(limit))
        .lean();

      const total = await PremiumSubscription.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: {
          subscriptions,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
            itemsPerPage: Number(limit),
          },
          filters: filter,
        },
      });
    } catch (error) {
      console.error("Error getting all subscriptions:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default PremiumController;
