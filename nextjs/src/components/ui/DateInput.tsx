"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";

interface DateInputProps {
  id: string;
  name: string;
  label: string;
  className?: string;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  name,
  label,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Field name={name}>
        {({ field, form }: any) => (
          <input
            {...field}
            id={id}
            type="date"
            disabled={disabled}
            onChange={(e) => {
              const date = new Date(e.target.value);
              form.setFieldValue(name, date);
            }}
            value={
              field.value instanceof Date
                ? field.value.toISOString().split("T")[0]
                : ""
            }
            className={`peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
              disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
            } ${className}`}
          />
        )}
      </Field>
      <label
        htmlFor={id}
        className="absolute left-4 -top-2.5 text-xs text-blue-600 bg-white px-2 rounded"
      >
        {label}
      </label>
      <div className="text-red-500 text-sm mt-1 min-h-[20px]">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
