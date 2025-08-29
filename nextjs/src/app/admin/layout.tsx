"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHome,
  IoStatsChart,
  IoPeople,
  IoDocumentText,
  IoSettings,
  IoLogOut,
  IoNotifications,
  IoSearch,
} from "react-icons/io5";
import ProfileBoxAdmin from "./components/ProfileBoxAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      href: "/admin/dashboard",
      icon: IoHome,
      label: "Dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/leads",
      icon: IoPeople,
      label: "Leads",
      active: pathname === "/admin/leads",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200/50">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <IoStatsChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-sm text-gray-600">Antoree System</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                    item.active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:scale-102"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 mr-3 transition-colors ${
                      item.active
                        ? "text-white"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-200/50 mt-8 pt-6">
            <Link
              href="/"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-102"
            >
              <IoHome className="w-5 h-5 mr-3 text-gray-500 group-hover:text-emerald-600" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {pathname === "/admin/dashboard" && "📊 Dashboard"}
                {pathname === "/admin/leads" && "👥 Quản lý Leads"}
              </h2>
              <div className="hidden md:block">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Profile */}
              <ProfileBoxAdmin />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
