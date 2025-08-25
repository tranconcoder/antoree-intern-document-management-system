"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Link
        href="/"
        className="absolute top-4 left-4 text-emerald-600 hover:underline"
      >
        ← Back
      </Link>

      <div className="bg-white text-gray-900 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-emerald-600">Welcome</h1>
          <p className="text-sm text-emerald-500">
            Please login or register to continue
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex mb-6 bg-gray-50 rounded-lg p-1">
          <Link
            href="/auth/login"
            className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
              isLogin
                ? "bg-emerald-600 text-white"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className={`flex-1 py-2 px-4 text-center rounded-md transition-colors ${
              !isLogin
                ? "bg-emerald-600 text-white"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            Register
          </Link>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
