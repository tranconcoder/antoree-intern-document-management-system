"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { HiHome } from "react-icons/hi";
import { IoDocumentText, IoSettingsSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import ProfileBox from "@/app/(home)/ProfileBox";

export default function NavBar() {
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
      <div className="max-w-8xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-300 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <IoDocumentText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Doc Manager
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
                        ? "bg-gradient-to-r from-blue-400 to-blue-700 text-white shadow-lg transform scale-105"
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
          <ProfileBox />
        </div>
      </div>
    </div>
  );
}
