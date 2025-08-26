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
  placeholder = "",
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
              className={`peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
                meta.touched && meta.error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              } ${
                disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
              } ${className}`}
            />
            <label
              htmlFor={id}
              className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                field.value || meta.touched
                  ? "-top-2.5 text-xs text-blue-600 bg-white px-2 rounded"
                  : "top-3.5 text-sm text-gray-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:bg-white peer-focus:px-2 peer-focus:rounded"
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
