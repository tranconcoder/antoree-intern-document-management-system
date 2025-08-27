"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "yellow" | "purple" | "red";
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color,
  loading = false
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600"
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600"
    },
    yellow: {
      bg: "bg-yellow-50",
      icon: "text-yellow-600"
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600"
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600"
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${colorClasses[color].icon}`} />
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
      
      {subtitle && (
        <p className="text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
