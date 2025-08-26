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
            className={`peer w-full px-3 py-2 border-b-2 border-gray-300 bg-transparent focus:border-emerald-600 focus:outline-none ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
          />
        )}
      </Field>
      <label
        htmlFor={id}
        className="absolute left-3 -top-2 text-emerald-600 text-xs"
      >
        {label}
      </label>
      <div className="text-red-500 text-sm mt-1 min-h-[20px]">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
