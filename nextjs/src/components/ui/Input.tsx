"use client";

import React from "react";
import { Field, ErrorMessage } from "formik";

interface InputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder = " ",
  className = "",
  disabled = false,
}) => {
  return (
    <div className="relative">
      <Field name={name}>
        {({ field, meta }: any) => (
          <>
            <input
              {...field}
              id={id}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={`peer w-full px-3 py-2 border-b-2 border-gray-300 bg-transparent focus:border-emerald-600 focus:outline-none ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              } ${className}`}
            />
            <label
              htmlFor={id}
              className={`absolute left-3 text-sm transition-all pointer-events-none ${
                field.value || meta.touched
                  ? "top-0 text-xs text-emerald-600"
                  : "top-2 text-gray-500 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-600"
              }`}
            >
              {label}
            </label>
          </>
        )}
      </Field>
      <div className="text-red-500 text-sm mt-1 min-h-[20px]">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};
