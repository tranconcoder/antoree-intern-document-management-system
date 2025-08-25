"use client";

import React from "react";
import { Formik, Form } from "formik";
import { loginSchema } from "@/app/validator/yup/login.yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/user.slice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type FormValues = {
  user_email: string;
  user_password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const initialValues: FormValues = {
    user_email: "",
    user_password: "",
  };

  // Validation handled by Yup schema (loginSchema)

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      setSubmitting(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        // show simple field error or generic
        setFieldError("user_email", data?.message || "Login failed");
        setSubmitting(false);
        return;
      }

      // dispatch credentials to store
      dispatch(setCredentials({ user: data.user, tokens: data.tokens }));

      // redirect to home
      router.push("/");
    } catch (err) {
      // generic error handling
      setFieldError("user_email", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Email Field */}
            <Input
              id="user_email"
              name="user_email"
              label="Email"
              type="email"
            />

            {/* Password Field */}
            <Input
              id="user_password"
              name="user_password"
              label="Mật khẩu"
              type="password"
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                Đăng nhập
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
