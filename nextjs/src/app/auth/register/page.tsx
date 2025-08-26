"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/app/validator/yup/register.yup";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRegister } from "@/store/thunks/user.thunk";
import { clearError } from "@/store/slices/user.slice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DateInput } from "@/components/ui/DateInput";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isLoggedIn, errorMessage } = useAppSelector(
    (state) => state.user
  );

  const initialValues: RegisterFormValues = {
    user_email: "",
    user_password: "",
    confirmPassword: "",
    user_firstName: "",
    user_lastName: "",
    user_gender: false,
    user_dayOfBirth: new Date(),
  };

  const genderOptions = [
    { value: false, label: "Nam" },
    { value: true, label: "Nữ" },
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Clear error when component mounts
  useEffect(() => {
    if (errorMessage) {
      dispatch(clearError());
    }
  }, []);

  const onSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, setFieldError, setStatus }: any
  ) => {
    try {
      // Clear any previous errors
      setStatus(null);
      dispatch(clearError());

      // Convert date to Unix timestamp and prepare payload
      const payloadForApi = {
        user_email: values.user_email,
        user_password: values.user_password,
        user_firstName: values.user_firstName,
        user_lastName: values.user_lastName,
        user_gender: values.user_gender,
        user_dayOfBirth: Math.floor(values.user_dayOfBirth.getTime() / 1000),
      };

      // Dispatch register thunk
      const result = await dispatch(fetchRegister(payloadForApi as any));

      if (fetchRegister.fulfilled.match(result)) {
        // Registration successful - redirect will happen via useEffect
        console.log("Registration successful");
      } else if (fetchRegister.rejected.match(result)) {
        // Registration failed - error is already in store, but also set form error
        const errorMsg = result.error.message || "Đăng ký thất bại";
        setFieldError("user_email", errorMsg);
        setStatus({ error: errorMsg });
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMsg = "Đã xảy ra lỗi không mong muốn";
      setFieldError("user_email", errorMsg);
      setStatus({ error: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Show global error message from store */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Show loading state */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">Đang xử lý đăng ký...</p>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            {/* Show form-level error */}
            {status?.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{status.error}</p>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="user_firstName"
                name="user_firstName"
                label="Họ"
                type="text"
                disabled={isLoading}
              />
              <Input
                id="user_lastName"
                name="user_lastName"
                label="Tên"
                type="text"
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <Input
              id="user_email"
              name="user_email"
              label="Email"
              type="email"
              disabled={isLoading}
            />

            {/* Password Fields */}
            <Input
              id="user_password"
              name="user_password"
              label="Mật khẩu"
              type="password"
              disabled={isLoading}
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              disabled={isLoading}
            />

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                id="user_gender"
                name="user_gender"
                label="Giới tính"
                options={genderOptions}
              />

              <DateInput
                id="user_dayOfBirth"
                name="user_dayOfBirth"
                label="Ngày sinh"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                isLoading={isSubmitting || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
