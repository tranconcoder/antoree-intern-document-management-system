"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { HiHome, HiUser } from "react-icons/hi";
import { IoDocumentText, IoSettingsSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";

export default function NavBar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navList = [
    {
      title: "Trang chủ",
      href: "/",
      icon: <HiHome className="w-5 h-5" />,
    },
    {
      title: "Tài liệu",
      href: "/documents",
      icon: <IoDocumentText className="w-5 h-5" />,
    },
    {
      title: "Cài đặt",
      href: "/settings",
      icon: <IoSettingsSharp className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-full h-16 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <IoDocumentText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                DocManager
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-2">
              {navList.map((navItem) => (
                <li key={navItem.href}>
                  <Link
                    href={navItem.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive(navItem.href)
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-md hover:scale-105"
                    }`}
                  >
                    {navItem.icon}
                    <span className="text-sm">{navItem.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile Box */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md">
                <HiUser className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-gray-800">
                  John Doe
                </div>
                <div className="text-xs text-gray-500">john@example.com</div>
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
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <HiUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          John Doe
                        </div>
                        <div className="text-xs text-gray-500">
                          john@example.com
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaCircleUser className="w-4 h-4 mr-3" />
                    Thông tin cá nhân
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
                    onClick={() => {
                      // Handle logout
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <BiLogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isProfileOpen && (
          <div className="md:hidden border-t border-gray-100 pt-4 pb-4 bg-gray-50/50 rounded-b-xl">
            <div className="space-y-2">
              {navList.map((navItem) => (
                <Link
                  key={navItem.href}
                  href={navItem.href}
                  onClick={() => setIsProfileOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(navItem.href)
                      ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-emerald-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {navItem.icon}
                  <span>{navItem.title}</span>
                </Link>
              ))}

              <hr className="my-3 border-gray-200" />

              <Link
                href="/profile"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:text-emerald-600 hover:bg-white hover:shadow-md transition-all duration-300"
                onClick={() => setIsProfileOpen(false)}
              >
                <FaCircleUser className="w-5 h-5" />
                <span>Thông tin cá nhân</span>
              </Link>

              <button
                onClick={() => {
                  // Handle logout
                  setIsProfileOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <BiLogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
