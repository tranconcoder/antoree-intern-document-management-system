import { Schema, model, Document, Types, Model } from "mongoose";

export interface IPremiumSubscription extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: string;
  planName: string;
  planType: "monthly" | "yearly" | "lifetime";
  amount: number;
  originalAmount: number;
  discountPercent: number;
  currency: string;
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  endDate?: Date; // null for lifetime
  purchaseDate: Date;
  features: string[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    source?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isCurrentlyActive: boolean;
  getRemainingDays(): number | null;
}

export interface IPremiumSubscriptionModel extends Model<IPremiumSubscription> {
  getActiveSubscription(
    userId: Types.ObjectId
  ): Promise<IPremiumSubscription | null>;
  getRevenueAnalytics(startDate: Date, endDate: Date): Promise<any[]>;
}

const premiumSubscriptionSchema = new Schema<
  IPremiumSubscription,
  IPremiumSubscriptionModel
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "lifetime"],
      index: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "lifetime"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    originalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currency: {
      type: String,
      default: "VND",
      enum: ["VND", "USD"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "expired", "cancelled"],
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      default: null, // null for lifetime plans
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    metadata: {
      ip: String,
      userAgent: String,
      source: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
premiumSubscriptionSchema.index({ userId: 1, status: 1 });
premiumSubscriptionSchema.index({ planType: 1, purchaseDate: 1 });
premiumSubscriptionSchema.index({ purchaseDate: 1 });
premiumSubscriptionSchema.index({ endDate: 1 }, { sparse: true });

// Virtual for checking if subscription is currently active
premiumSubscriptionSchema.virtual("isCurrentlyActive").get(function () {
  if (this.status !== "active") return false;
  if (this.planType === "lifetime") return true;
  if (this.endDate && this.endDate > new Date()) return true;
  return false;
});

// Method to calculate remaining days
premiumSubscriptionSchema.methods.getRemainingDays = function () {
  if (this.planType === "lifetime") return null;
  if (!this.endDate) return 0;
  const now = new Date();
  const diffTime = this.endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Static method to get active subscription for a user
premiumSubscriptionSchema.statics.getActiveSubscription = async function (
  userId: Types.ObjectId
) {
  console.log("🔍 getActiveSubscription called with userId:", userId);
  const now = new Date();

  // Use MongoDB aggregation to avoid casting issues
  const result = await this.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        status: "active",
      },
    },
    {
      $match: {
        $or: [
          { planType: "lifetime" },
          {
            $and: [
              { planType: { $in: ["monthly", "yearly"] } },
              { endDate: { $gt: now } },
            ],
          },
        ],
      },
    },
    {
      $sort: { purchaseDate: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  console.log(
    "📋 Aggregation result:",
    result.length > 0 ? "Found" : "Not found"
  );

  return result.length > 0 ? result[0] : null;
};

// Static method for revenue analytics
premiumSubscriptionSchema.statics.getRevenueAnalytics = function (
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        purchaseDate: {
          $gte: startDate,
          $lte: endDate,
        },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: {
          planType: "$planType",
          month: { $month: "$purchaseDate" },
          year: { $year: "$purchaseDate" },
        },
        totalRevenue: { $sum: "$amount" },
        totalSubscriptions: { $sum: 1 },
        averageAmount: { $avg: "$amount" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.planType": 1,
      },
    },
  ]);
};

export const PremiumSubscription = model<
  IPremiumSubscription,
  IPremiumSubscriptionModel
>("PremiumSubscription", premiumSubscriptionSchema);
export default PremiumSubscription;
