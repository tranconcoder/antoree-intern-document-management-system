"use client";

import React from "react";
import ChartCard from "../components/ChartCard";
import { IoSettings, IoNotifications, IoShield, IoServer } from "react-icons/io5";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system configuration and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="General Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <IoSettings className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">System Configuration</p>
                  <p className="text-sm text-gray-600">Basic system settings</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <IoNotifications className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-600">Email and alert settings</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Security & Access">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <IoShield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Access Control</p>
                  <p className="text-sm text-gray-600">User permissions and roles</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <IoServer className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">API Settings</p>
                  <p className="text-sm text-gray-600">Backend configuration</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="System Status">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-3"></div>
            <p className="font-medium text-green-900">API Status</p>
            <p className="text-sm text-green-700">Online</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-3"></div>
            <p className="font-medium text-green-900">Database</p>
            <p className="text-sm text-green-700">Connected</p>
          </div>
          
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-3"></div>
            <p className="font-medium text-yellow-900">Monitoring</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
        </div>
      </ChartCard>
    </div>
  );
}
