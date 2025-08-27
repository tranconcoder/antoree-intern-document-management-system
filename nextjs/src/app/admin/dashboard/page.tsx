"use client";

import React, { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import { 
  IoEye, 
  IoPeople, 
  IoCard, 
  IoCash,
  IoTrendingUp,
  IoCalendar,
  IoRefresh
} from "react-icons/io5";
import axios from "@/services/axios.service";

interface DashboardStats {
  traffic: {
    total: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  leads: {
    total: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  orders: {
    total: number;
    revenue: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  conversionRate: {
    leadsToTraffic: number;
    revenueToTraffic: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Mock data cho demo (sẽ thay bằng API calls thực tế)
  const mockStats: DashboardStats = {
    traffic: {
      total: 12450,
      change: "+12.5%",
      trend: "up"
    },
    leads: {
      total: 0, // Sẽ load từ API thực tế
      change: "+8.2%", 
      trend: "up"
    },
    orders: {
      total: 145,
      revenue: 2450000,
      change: "+15.3%",
      trend: "up"
    },
    conversionRate: {
      leadsToTraffic: 0, // Sẽ tính toán từ leads/traffic
      revenueToTraffic: 0 // Sẽ tính toán từ revenue/traffic
    }
  };

  const fetchLeadStats = async () => {
    try {
      const response = await axios.get("/leads/stats");
      if (response.data && response.data.total !== undefined) {
        return response.data.total;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      return 0;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch leads data từ API thực tế
      const leadsTotal = await fetchLeadStats();
      
      // Tính toán conversion rates
      const leadsToTraffic = mockStats.traffic.total > 0 
        ? ((leadsTotal / mockStats.traffic.total) * 100).toFixed(2)
        : "0.00";
      
      const revenueToTraffic = mockStats.traffic.total > 0
        ? ((mockStats.orders.revenue / mockStats.traffic.total)).toFixed(0)
        : "0";

      const updatedStats: DashboardStats = {
        ...mockStats,
        leads: {
          ...mockStats.leads,
          total: leadsTotal
        },
        conversionRate: {
          leadsToTraffic: parseFloat(leadsToTraffic),
          revenueToTraffic: parseFloat(revenueToTraffic)
        }
      };

      setStats(updatedStats);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Key metrics overview</p>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IoRefresh className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Stats - Only Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Website Traffic"
          value={stats?.traffic.total || 0}
          subtitle="Total Visitors"
          icon={IoEye}
          color="blue"
          loading={loading}
        />
        
        <StatsCard
          title="Total Leads"
          value={stats?.leads.total || 0}
          subtitle="Form Submissions"
          icon={IoPeople}
          color="green"
          loading={loading}
        />
        
        <StatsCard
          title="Orders"
          value={stats?.orders.total || 0}
          subtitle="Total Orders"
          icon={IoCard}
          color="purple"
          loading={loading}
        />
        
        <StatsCard
          title="Revenue"
          value={`${(stats?.orders.revenue || 0).toLocaleString()}đ`}
          subtitle="Total Revenue"
          icon={IoCash}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Conversion Rates - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats?.conversionRate.leadsToTraffic || 0}%
          </div>
          <p className="text-gray-600">Leads from Traffic</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue per Visitor</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats?.conversionRate.revenueToTraffic || 0}đ
          </div>
          <p className="text-gray-600">Average Revenue</p>
        </div>
      </div>
    </div>
  );
}
