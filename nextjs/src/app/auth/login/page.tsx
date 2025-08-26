"use client";

import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { loginSchema } from "@/app/validator/yup/login.yup";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLogin } from "@/store/thunks/user.thunk";
import { clearError } from "@/store/slices/user.slice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type FormValues = {
  user_email: string;
  user_password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isLoggedIn, errorMessage } = useAppSelector(
    (state) => state.user
  );

  const initialValues: FormValues = {
    user_email: "",
    user_password: "",
  };

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

  const onSubmit = async (values: FormValues) => {
    // Dispatch login thunk
    await dispatch(fetchLogin(values));
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
          <span>Đang xử lý đăng nhập...</span>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-4">
            {/* Email Field */}
            <Input
              id="user_email"
              name="user_email"
              label="Email"
              type="email"
              disabled={isLoading}
            />

            {/* Password Field */}
            <Input
              id="user_password"
              name="user_password"
              label="Mật khẩu"
              type="password"
              disabled={isLoading}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                isLoading={isSubmitting || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
