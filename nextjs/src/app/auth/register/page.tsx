"use client";

import React from "react";
import { Formik, Form } from "formik";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/app/validator/yup/register.yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/user.slice";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DateInput } from "@/components/ui/DateInput";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const onSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      setSubmitting(true);

      // Convert date to Unix timestamp (seconds)
      const payload = {
        ...values,
        user_dayOfBirth: Math.floor(values.user_dayOfBirth.getTime() / 1000),
        // Remove confirmPassword from payload
        confirmPassword: undefined,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (data.errors) {
          Object.keys(data.errors).forEach((field) => {
            setFieldError(field, data.errors[field]);
          });
        } else {
          setFieldError("user_email", data?.message || "Đăng ký thất bại");
        }
        setSubmitting(false);
        return;
      }

      // Successful registration - dispatch credentials to store
      dispatch(setCredentials({ user: data.user, tokens: data.tokens }));

      // Redirect to home
      router.push("/");
    } catch (err) {
      setFieldError("user_email", "Đã xảy ra lỗi không mong muốn");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="user_firstName"
                name="user_firstName"
                label="Họ"
                type="text"
              />
              <Input
                id="user_lastName"
                name="user_lastName"
                label="Tên"
                type="text"
              />
            </div>

            {/* Email Field */}
            <Input
              id="user_email"
              name="user_email"
              label="Email"
              type="email"
            />

            {/* Password Fields */}
            <Input
              id="user_password"
              name="user_password"
              label="Mật khẩu"
              type="password"
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
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
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                Đăng ký
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
