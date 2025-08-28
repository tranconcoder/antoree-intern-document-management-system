"use client";

import React, { useState, useEffect } from "react";
import { IoMail, IoSearch, IoTrash } from "react-icons/io5";
import axios from "@/services/axios.service";

interface Lead {
  id: string;
  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  lead_company?: string;
  lead_message?: string;
  lead_status: string;
  lead_tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function Avatar({ name }: { name?: string }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-semibold text-gray-800">
      {initials}
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axios.get(`/leads?${params}`);

      if (response.data && response.data.metadata) {
        const data: LeadsResponse = response.data.metadata;
        setLeads(data.leads || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error loading leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [currentPage, searchTerm]);

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      setActionMessage(null);
      setActionError(null);
      setUpdatingId(leadId);
      await axios.patch(`/leads/${leadId}/status`, { status });
      setActionMessage("Cập nhật trạng thái thành công");
      // refresh
      await loadLeads();
    } catch (err: any) {
      console.error(err);
      setActionError(
        err?.response?.data?.successDetail || err.message || "Lỗi"
      );
    } finally {
      setUpdatingId(null);
      setTimeout(() => setActionMessage(null), 2500);
    }
  };

  const deleteLead = async (leadId: string) => {
    const ok = window.confirm("Xác nhận xóa lead này?");
    if (!ok) return;
    try {
      setActionError(null);
      setDeletingId(leadId);
      await axios.delete(`/leads/${leadId}`);
      setActionMessage("Xóa lead thành công");
      await loadLeads();
    } catch (err: any) {
      console.error(err);
      setActionError(
        err?.response?.data?.successDetail || err.message || "Lỗi"
      );
    } finally {
      setDeletingId(null);
      setTimeout(() => setActionMessage(null), 2500);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Danh sách liên hệ từ form</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 text-sm">
            <div className="text-xs text-gray-500">Tổng</div>
            <div className="font-semibold text-lg">{pagination.total}</div>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {loading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            <IoMail className="w-12 h-12 mx-auto mb-3" />
            Không tìm thấy leads
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <Avatar name={lead.lead_name} />
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="font-semibold text-gray-900">
                      {lead.lead_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      • {formatDate(lead.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{lead.lead_email}</div>
                  <div className="text-sm text-gray-600">
                    {lead.lead_phone || "-"}{" "}
                    {lead.lead_company ? `• ${lead.lead_company}` : ""}
                  </div>
                  {lead.lead_message && (
                    <div className="mt-2 text-sm text-gray-700 max-w-xl truncate">
                      {lead.lead_message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div>
                  <select
                    value={lead.lead_status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    disabled={updatingId === lead.id}
                    className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="qualified">qualified</option>
                    <option value="converted">converted</option>
                    <option value="lost">lost</option>
                  </select>
                </div>

                <button
                  onClick={() => deleteLead(lead.id)}
                  disabled={deletingId === lead.id}
                  className="flex items-center space-x-2 px-3 py-2 border border-red-200 rounded-md text-red-600 hover:bg-red-50"
                >
                  <IoTrash className="w-4 h-4" />
                  <span className="text-sm">Xóa</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trên {pagination.total}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-sm text-gray-700">
              Trang {pagination.page} / {pagination.totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
