"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import {
  registerSchema,
  type RegisterFormValues,
  type RegisterApiPayload,
} from "@/app/validator/yup/register.yup";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRegister } from "@/store/thunks/user.thunk";
import { clearError } from "@/store/slices/user.slice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DateInput } from "@/components/ui/DateInput";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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
    user_dayOfBirth: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), // Default to 18 years ago
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

  const onSubmit = async (values: RegisterFormValues) => {
    // Convert date to Unix timestamp and prepare payload
    const payloadForApi: RegisterApiPayload = {
      user_email: values.user_email,
      user_password: values.user_password,
      user_firstName: values.user_firstName,
      user_lastName: values.user_lastName,
      user_gender: values.user_gender,
      user_dayOfBirth: Math.floor(values.user_dayOfBirth.getTime() / 1000),
    };

    // Dispatch register thunk
    await dispatch(fetchRegister(payloadForApi));
  };

  return (
    <div className="w-full">
      {/* Show global error message from store */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-400 hover:text-red-600 ml-2 w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="user_firstName"
                name="user_firstName"
                label="Họ và tên đệm"
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
              label="Địa chỉ email"
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
                disabled={isLoading}
              />

              <DateInput
                id="user_dayOfBirth"
                name="user_dayOfBirth"
                label="Ngày sinh"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                isLoading={isSubmitting || isLoading}
                className="w-full"
                size="lg"
              >
                Tạo tài khoản
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mt-4">
                Đã có tài khoản?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
