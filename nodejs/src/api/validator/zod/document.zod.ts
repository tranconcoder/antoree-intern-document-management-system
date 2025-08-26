import * as z from "zod";

export const uploadDocumentBody = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500),
  isPublic: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    throw new Error("Invalid boolean value");
  }),
  isPremium: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    throw new Error("Invalid boolean value");
  }),
});

export type UploadDocumentBody = z.infer<typeof uploadDocumentBody>;
