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
            className={`peer w-full px-3 py-2 border-b-2 border-gray-300 bg-transparent focus:border-emerald-600 focus:outline-none ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
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
