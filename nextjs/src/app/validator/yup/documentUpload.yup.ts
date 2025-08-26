import * as Yup from "yup";

export const documentUploadValidationSchema = Yup.object({
  title: Yup.string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự")
    .required("Tiêu đề là bắt buộc"),
  description: Yup.string()
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .required("Mô tả là bắt buộc"),
  isPremium: Yup.boolean().default(false),
  isPublic: Yup.boolean().default(false),
});

export type DocumentUploadFormValues = {
  title: string;
  description: string;
  isPremium: boolean;
  isPublic: boolean;
};
