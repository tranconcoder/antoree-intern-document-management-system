import * as Yup from "yup";

export const registerSchema = Yup.object({
  user_email: Yup.string()
    .email("Vui lòng nhập email hợp lệ")
    .required("Email là bắt buộc"),

  user_password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(24, "Mật khẩu không được quá 24 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9])[^\s]+$/,
      "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một số, một ký tự đặc biệt và không chứa khoảng trắng"
    )
    .required("Mật khẩu là bắt buộc"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("user_password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),

  user_firstName: Yup.string().required("Họ là bắt buộc"),

  user_lastName: Yup.string().required("Tên là bắt buộc"),

  user_gender: Yup.boolean().required("Giới tính là bắt buộc"),

  user_dayOfBirth: Yup.date()
    .max(
      new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000),
      "Bạn phải từ 13 tuổi trở lên"
    )
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai")
    .required("Ngày sinh là bắt buộc"),
});

export type RegisterFormValues = {
  user_email: string;
  user_password: string;
  confirmPassword: string;
  user_firstName: string;
  user_lastName: string;
  user_gender: boolean;
  user_dayOfBirth: Date;
};

export type RegisterApiPayload = {
  user_email: string;
  user_password: string;
  user_firstName: string;
  user_lastName: string;
  user_gender: boolean;
  user_dayOfBirth: number;
};
