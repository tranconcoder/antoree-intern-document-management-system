import leadController from "@/controllers/lead.controller";
import { RequestSource } from "@/enums/requestSource.enum";
import { catchAsyncExpress } from "@/middlewares/async.middleware.";
import validateZodPayload from "@/middlewares/zod.middleware";
import {
  createLeadSchema,
  getLeadsSchema,
  getLeadStatsSchema,
} from "@/validator/zod/lead.zod";
import { Router } from "express";

const leadRouter = Router();

leadRouter.post(
  "/",
  validateZodPayload(RequestSource.Body, createLeadSchema),
  catchAsyncExpress(leadController.createLead)
);

leadRouter.get(
  "/",
  validateZodPayload(RequestSource.Query, getLeadsSchema),
  catchAsyncExpress(leadController.getLeads)
);

leadRouter.get(
  "/stats",
  validateZodPayload(RequestSource.Query, getLeadStatsSchema),
  catchAsyncExpress(leadController.getLeadStats)
);

leadRouter.get("/:leadId", catchAsyncExpress(leadController.getLeadById));

leadRouter.patch(
  "/:leadId/status",
  catchAsyncExpress(leadController.updateLeadStatus)
);

leadRouter.delete("/:leadId", catchAsyncExpress(leadController.deleteLead));

export default leadRouter;
