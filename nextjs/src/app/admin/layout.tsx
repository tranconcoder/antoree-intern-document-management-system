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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Antoree System</p>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 px-3">
            <button className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full">
              <IoLogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {pathname === "/admin/dashboard" && "Dashboard"}
                {pathname === "/admin/leads" && "Leads"}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
