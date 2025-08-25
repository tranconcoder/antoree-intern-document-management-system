import * as yup from "yup";

export const loginSchema = yup.object({
  user_email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  user_password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
