import * as z from "zod";

export const registerUserSchema = z.object({
  user_email: z.email("Please enter a valid email").min(1, "Email is required"),
  user_firstName: z.string().min(1, "First name is required"),
  user_lastName: z.string().min(1, "Last name is required"),
  user_gender: z.boolean(),
  user_dayOfBirth: z.preprocess(
    (val) => {
      // allow numeric strings like "1630454400" or numbers like 1630454400
      if (typeof val === "string" && /^\d+$/.test(val)) return Number(val);
      if (typeof val === "number") return val;
      return val;
    },
    z
      .number()
      .refine((n) => Number.isFinite(n) && n > 0, {
        message: "Invalid unix timestamp",
      })
      .transform((n) => {
        // if timestamp looks like seconds (around 10 digits), convert to milliseconds
        if (Math.abs(n) < 1e11) n = n * 1000;
        return new Date(n);
      })
  ),

  user_premiumTicket: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })
    .optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
