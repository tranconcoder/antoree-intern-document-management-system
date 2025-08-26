"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform active:scale-95";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl disabled:from-blue-300 disabled:to-blue-400 disabled:shadow-none",
    secondary:
      "bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none",
    outline:
      "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 disabled:border-blue-300 disabled:text-blue-300 disabled:hover:bg-transparent",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${
        isDisabled
          ? "opacity-70 cursor-not-allowed transform-none"
          : "hover:scale-105"
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Đang xử lý...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
