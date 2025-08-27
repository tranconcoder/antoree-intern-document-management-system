import * as z from "zod";

export const createLeadSchema = z.object({
  lead_name: z.string().min(1, "Lead name is required"),
  lead_email: z.string().email("Please enter a valid email"),
  lead_phone: z.string().optional(),
  lead_company: z.string().optional(),
  lead_message: z.string().optional(),
  lead_tags: z.array(z.string()).optional(),
  lead_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  lead_name: z.string().min(1, "Lead name is required").optional(),
  lead_email: z.string().email("Please enter a valid email").optional(),
  lead_phone: z.string().optional(),
  lead_company: z.string().optional(),
  lead_message: z.string().optional(),
  lead_status: z
    .enum(["new", "contacted", "qualified", "converted", "lost"])
    .optional(),
  lead_tags: z.array(z.string()).optional(),
  lead_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const getLeadsSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page must be greater than 0")
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
    .optional(),
  status: z
    .enum(["new", "contacted", "qualified", "converted", "lost"])
    .optional(),
  search: z.string().optional(),
});

export type GetLeadsInput = z.infer<typeof getLeadsSchema>;

export const getLeadStatsSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type GetLeadStatsInput = z.infer<typeof getLeadStatsSchema>;
