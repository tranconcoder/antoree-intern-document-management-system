"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/thunks/user.thunk";
import Link from "next/link";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaCircleUser } from "react-icons/fa6";
import { HiUser } from "react-icons/hi";
import { IoHome, IoSettingsSharp, IoShieldCheckmark } from "react-icons/io5";

export interface ProfileBoxAdminProps {}

export default function ProfileBoxAdmin({}: ProfileBoxAdminProps) {
  const dispatch = useAppDispatch();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = useAppSelector((state) => state.user.user);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const userFullName =
    `${user?.user_firstName || ""} ${user?.user_lastName || ""}`.trim() ||
    "Admin";

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center">
        <Link
          href="/auth/login"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg transition-all duration-300"
        >
          <HiUser className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
          <HiUser className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold text-gray-800">
            {userFullName}
          </div>
          <div className="text-xs text-gray-500">
            {user?.user_email || "admin@antoree.com"}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isProfileOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isProfileOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <HiUser className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {userFullName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <IoShieldCheckmark className="w-3 h-3 mr-1 text-green-500" />
                    Administrator
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsProfileOpen(false)}
            >
              <IoShieldCheckmark className="w-4 h-4 mr-3" />
              Admin Dashboard
            </Link>

            <Link
              href="/"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
              onClick={() => setIsProfileOpen(false)}
            >
              <IoHome className="w-4 h-4 mr-3" />
              Về trang chủ
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
              onClick={() => setIsProfileOpen(false)}
            >
              <IoSettingsSharp className="w-4 h-4 mr-3" />
              Cài đặt
            </Link>

            <hr className="my-2 border-gray-100" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <BiLogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
