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
        validationSchema={loginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form className="space-y-6">
            {/* Email Field */}
            <Input
              id="user_email"
              name="user_email"
              label="Địa chỉ email"
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                Quên mật khẩu?
              </Link>
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
                Đăng nhập
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mt-4">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
