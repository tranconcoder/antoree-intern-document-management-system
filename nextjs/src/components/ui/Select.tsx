"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";

interface SelectProps {
  id: string;
  name: string;
  label: string;
  options: { value: string | boolean; label: string }[];
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  options,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Field name={name}>
        {({ field, form }: any) => (
          <select
            {...field}
            id={id}
            disabled={disabled}
            onChange={(e) => {
              const value = e.target.value;
              // Convert string to boolean if needed
              const parsedValue =
                value === "true" ? true : value === "false" ? false : value;
              form.setFieldValue(name, parsedValue);
            }}
            value={String(field.value)}
            className={`peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
              disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
            } ${className}`}
          >
            <option value="" disabled>
              Chọn {label.toLowerCase()}
            </option>
            {options.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
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
