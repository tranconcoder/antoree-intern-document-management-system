import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import leadModel from "@/models/lead.model";
import type { CreateLeadInput } from "@/validator/zod/lead.zod";

export default class LeadService {
  public static async createLead(payload: CreateLeadInput): Promise<any> {
    // Check if email has reached daily limit (3 times per day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayLeadCount = await leadModel.countDocuments({
      lead_email: payload.lead_email,
      created_at: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    if (todayLeadCount >= 3) {
      throw new ErrorResponse({
        errorResponseItem: errorResponses.EMAIL_DAILY_LIMIT_EXCEEDED,
      });
    }

    // Create new lead
    const newLead = await leadModel.create(payload);

    return {
      id: newLead._id.toString(),
      lead_name: newLead.lead_name,
      lead_email: newLead.lead_email,
      lead_phone: newLead.lead_phone,
      lead_company: newLead.lead_company,
      lead_message: newLead.lead_message,
      lead_status: newLead.lead_status,
      lead_tags: newLead.lead_tags,
      createdAt: newLead.created_at,
      updatedAt: newLead.updated_at,
    };
  }

  public static async getLeads(query: any): Promise<any> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (query.status) {
      filter.lead_status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { lead_name: { $regex: query.search, $options: "i" } },
        { lead_email: { $regex: query.search, $options: "i" } },
        { lead_company: { $regex: query.search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await leadModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get leads with pagination
    const leads = await leadModel
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedLeads = leads.map((lead) => ({
      id: lead._id.toString(),
      lead_name: lead.lead_name,
      lead_email: lead.lead_email,
      lead_phone: lead.lead_phone,
      lead_company: lead.lead_company,
      lead_message: lead.lead_message,
      lead_status: lead.lead_status,
      lead_tags: lead.lead_tags,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
    }));

    return {
      leads: formattedLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public static async getLeadById(leadId: string): Promise<any> {
    const lead = await leadModel.findById(leadId).lean();

    if (!lead) {
      throw new ErrorResponse({
        errorResponseItem: errorResponses.LEAD_NOT_FOUND,
      });
    }

    return {
      id: lead._id.toString(),
      lead_name: lead.lead_name,
      lead_email: lead.lead_email,
      lead_phone: lead.lead_phone,
      lead_company: lead.lead_company,
      lead_message: lead.lead_message,
      lead_status: lead.lead_status,
      lead_tags: lead.lead_tags,
      createdAt: lead.created_at,
      updatedAt: lead.updated_at,
    };
  }

  public static async getLeadStats(query: any): Promise<any> {
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(2020, 0, 1);
    const endDate = query.endDate ? new Date(query.endDate) : new Date();

    // Total leads
    const total = await leadModel.countDocuments({
      created_at: { $gte: startDate, $lte: endDate },
    });

    // Stats by status
    const statusStats = await leadModel.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$lead_status",
          count: { $sum: 1 },
        },
      },
    ]);

    const byStatus: Record<string, number> = {};
    statusStats.forEach((stat) => {
      byStatus[stat._id] = stat.count;
    });

    // Daily stats
    const dailyStats = await leadModel.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const daily: Record<string, number> = {};
    dailyStats.forEach((stat) => {
      daily[stat._id] = stat.count;
    });

    // Monthly stats
    const monthlyStats = await leadModel.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthly: Record<string, number> = {};
    monthlyStats.forEach((stat) => {
      monthly[stat._id] = stat.count;
    });

    // Yearly stats
    const yearlyStats = await leadModel.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y", date: "$created_at" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const yearly: Record<string, number> = {};
    yearlyStats.forEach((stat) => {
      yearly[stat._id] = stat.count;
    });

    return {
      total,
      byStatus,
      byDate: {
        daily,
        monthly,
        yearly,
      },
    };
  }
}
