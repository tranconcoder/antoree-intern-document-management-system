"use client";

import React from "react";
import ChartCard from "../components/ChartCard";
import StatsCard from "../components/StatsCard";
import { IoCard, IoCash, IoTrendingUp, IoCalendar } from "react-icons/io5";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders & Revenue</h1>
        <p className="text-gray-600">Track orders and revenue performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value="1,245"
          subtitle="All time"
          trend="up"
          trendValue="+23.1%"
          icon={IoCard}
          color="blue"
        />
        
        <StatsCard
          title="This Month"
          value="145"
          subtitle="Orders this month"
          trend="up"
          trendValue="+15.3%"
          icon={IoCalendar}
          color="green"
        />
        
        <StatsCard
          title="Total Revenue"
          value="24,500,000đ"
          subtitle="All time"
          trend="up"
          trendValue="+18.7%"
          icon={IoCash}
          color="yellow"
        />
        
        <StatsCard
          title="Avg. Order Value"
          value="1,967,000đ"
          subtitle="This month"
          trend="up"
          trendValue="+5.2%"
          icon={IoTrendingUp}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trends">
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IoCash className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Coming Soon</p>
              <p>Revenue analytics will be implemented</p>
              <p className="text-sm">when order system is ready</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Order Distribution">
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IoCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Coming Soon</p>
              <p>Order distribution charts</p>
              <p className="text-sm">will be implemented</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Orders Table Placeholder */}
      <ChartCard title="Recent Orders">
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <IoCard className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">Orders Management</p>
            <p>Order tracking and management</p>
            <p className="text-sm">Backend integration required</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
