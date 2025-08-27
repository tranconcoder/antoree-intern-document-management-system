"use client";

import React from "react";
import ChartCard from "../components/ChartCard";
import StatsCard from "../components/StatsCard";
import { IoTrendingUp, IoEye, IoPeople, IoTime } from "react-icons/io5";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed analytics and insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Page Views"
          value="45,230"
          subtitle="This month"
          trend="up"
          trendValue="+12.5%"
          icon={IoEye}
          color="blue"
        />

        <StatsCard
          title="Unique Visitors"
          value="12,450"
          subtitle="This month"
          trend="up"
          trendValue="+8.2%"
          icon={IoPeople}
          color="green"
        />

        <StatsCard
          title="Avg. Session Time"
          value="3m 24s"
          subtitle="This month"
          trend="up"
          trendValue="+15.3%"
          icon={IoTime}
          color="purple"
        />

        <StatsCard
          title="Bounce Rate"
          value="42.3%"
          subtitle="This month"
          trend="down"
          trendValue="-5.1%"
          icon={IoTrendingUp}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Traffic Trends">
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IoTrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Coming Soon</p>
              <p>Traffic analytics will be implemented</p>
              <p className="text-sm">when backend tracking is ready</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="User Behavior">
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IoPeople className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Coming Soon</p>
              <p>User behavior analytics</p>
              <p className="text-sm">will be implemented</p>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Real-time Analytics">
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <IoEye className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium">Real-time Dashboard</p>
            <p>Live analytics and monitoring</p>
            <p className="text-sm">Backend integration required</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
