"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoDocumentText, IoArrowBack } from "react-icons/io5";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50"></div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 z-10"
      >
        <IoArrowBack className="w-5 h-5" />
        <span className="font-medium">Về trang chủ</span>
      </Link>

      {/* Main Auth Container */}
      <div
        className={`relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-md ${
          isLogin ? "p-8" : "p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <IoDocumentText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doc Manager</h1>
          <p className="text-gray-600">
            {isLogin ? "Chào mừng bạn quay trở lại" : "Tạo tài khoản mới"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-100 rounded-xl p-1 sticky top-0 z-10">
          <Link
            href="/auth/login"
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-all duration-300 font-medium ${
              isLogin
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg transform scale-[0.98]"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/auth/register"
            className={`flex-1 py-3 px-4 text-center rounded-lg transition-all duration-300 font-medium ${
              !isLogin
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg transform scale-[0.98]"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Đăng ký
          </Link>
        </div>

        {/* Form Content */}
        <div className={isLogin ? "" : "pb-4"}>{children}</div>
      </div>
    </div>
  );
}
