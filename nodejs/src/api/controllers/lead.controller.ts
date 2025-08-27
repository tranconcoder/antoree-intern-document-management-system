import { successResponses } from "@/constants/success.constant";
import SuccessResponse from "@/core/success";
import LeadService from "@/services/lead.service";
import type {
  CreateLeadInput,
  GetLeadsInput,
  GetLeadStatsInput,
} from "@/validator/zod/lead.zod";
import type { Handler } from "express";

export default new (class LeadController {
  public createLead: Handler = async (req, res, next) => {
    const leadPayload = req.body as CreateLeadInput;

    new SuccessResponse({
      detail: "Lead created successfully",
      successResponseItem: successResponses.LEAD_CREATE_SUCCESS,
      metadata: await LeadService.createLead(leadPayload),
    }).sendResponse(res);
  };

  public getLeads: Handler = async (req, res, next) => {
    const query = req.query as unknown as GetLeadsInput;

    new SuccessResponse({
      detail: "Leads retrieved successfully",
      successResponseItem: successResponses.LEAD_GET_SUCCESS,
      metadata: await LeadService.getLeads(query),
    }).sendResponse(res);
  };

  public getLeadById: Handler = async (req, res, next) => {
    const { leadId } = req.params;

    if (!leadId) {
      throw new Error("Lead ID is required");
    }

    new SuccessResponse({
      detail: "Lead retrieved successfully",
      successResponseItem: successResponses.LEAD_GET_SUCCESS,
      metadata: await LeadService.getLeadById(leadId),
    }).sendResponse(res);
  };

  public getLeadStats: Handler = async (req, res, next) => {
    const query = req.query as unknown as GetLeadStatsInput;

    new SuccessResponse({
      detail: "Lead stats retrieved successfully",
      successResponseItem: successResponses.LEAD_STATS_SUCCESS,
      metadata: await LeadService.getLeadStats(query),
    }).sendResponse(res);
  };
})();
