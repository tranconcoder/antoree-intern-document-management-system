"use client";

import React, { useState, useEffect } from "react";
import { IoMail, IoSearch, IoTrash, IoClose } from "react-icons/io5";
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
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-sm font-semibold text-white shadow-lg">
      {initials}
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
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
  }, [currentPage, searchTerm, statusFilter]);

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
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setLeadToDelete(lead);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      setActionError(null);
      setDeletingId(leadToDelete.id);
      setShowDeleteModal(false);
      await axios.delete(`/leads/${leadToDelete.id}`);
      setActionMessage("Xóa lead thành công");
      await loadLeads();
    } catch (err: any) {
      console.error(err);
      setActionError(
        err?.response?.data?.successDetail || err.message || "Lỗi"
      );
    } finally {
      setDeletingId(null);
      setLeadToDelete(null);
      setTimeout(() => setActionMessage(null), 2500);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      new: "🆕 New",
      contacted: "📞 Contacted",
      qualified: "✅ Qualified",
      converted: "🎉 Converted",
      lost: "❌ Lost",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              💼 Quản lý Leads
            </h1>
            <p className="text-gray-600 mt-2">
              Danh sách liên hệ từ form website
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl px-4 py-3 shadow-md border border-blue-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Tổng số
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {pagination.total}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {actionMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 shadow-md">
          <div className="flex items-center">
            <div className="text-green-600 font-medium">✅ {actionMessage}</div>
          </div>
        </div>
      )}

      {actionError && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-md">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">❌ {actionError}</div>
          </div>
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 relative">
            <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, email hoặc công ty..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                🏷️ Trạng thái:
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-w-[140px] text-sm font-medium"
              >
                <option value="">Tất cả</option>
                <option value="new">🆕 New</option>
                <option value="contacted">📞 Contacted</option>
                <option value="qualified">✅ Qualified</option>
                <option value="converted">🎉 Converted</option>
                <option value="lost">❌ Lost</option>
              </select>
            </div>

            {/* Total count */}
            <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-200">
              <div className="text-xs text-gray-500">
                {statusFilter
                  ? `${getStatusDisplayName(statusFilter)}`
                  : "Tổng"}
              </div>
              <div className="font-bold text-blue-600">{pagination.total}</div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">
                🔧 Bộ lọc hiện tại:
              </span>

              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  🔍 "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}

              {statusFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  🏷️ {getStatusDisplayName(statusFilter)}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          // Loading skeleton
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 py-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <IoMail className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Chưa có leads nào
            </h3>
            <p className="text-gray-500">
              Hãy đợi khách hàng gửi thông tin liên hệ
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
                    👤 Thông tin
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
                    📞 Liên hệ
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
                    💼 Công ty
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[250px]">
                    💬 Tin nhắn
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">
                    🏷️ Trạng thái
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                    📅 Ngày tạo
                  </th>
                  <th className="px-8 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                    ⚡ Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* Thông tin */}
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <Avatar name={lead.lead_name} />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                            {lead.lead_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {lead.lead_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Liên hệ */}
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 truncate max-w-[160px]">
                          📧 {lead.lead_email}
                        </div>
                        {lead.lead_phone && (
                          <div className="text-sm text-gray-600 whitespace-nowrap">
                            📱 {lead.lead_phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Công ty */}
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-900">
                        {lead.lead_company ? (
                          <span className="truncate max-w-[130px] block">
                            🏢 {lead.lead_company}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Chưa có</span>
                        )}
                      </div>
                    </td>

                    {/* Tin nhắn */}
                    <td className="px-8 py-5">
                      {lead.lead_message ? (
                        <div
                          className="text-sm text-gray-700 truncate max-w-[230px]"
                          title={lead.lead_message}
                        >
                          💬 {lead.lead_message}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          Chưa có tin nhắn
                        </span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-8 py-5">
                      <select
                        value={lead.lead_status}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value)
                        }
                        disabled={updatingId === lead.id}
                        className={`text-xs border-0 rounded-lg px-3 py-2 font-medium transition-all duration-300 focus:ring-2 focus:ring-blue-500 w-full max-w-[120px] ${
                          lead.lead_status === "new"
                            ? "bg-green-100 text-green-700"
                            : lead.lead_status === "contacted"
                            ? "bg-blue-100 text-blue-700"
                            : lead.lead_status === "qualified"
                            ? "bg-yellow-100 text-yellow-700"
                            : lead.lead_status === "converted"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="new">🆕 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="qualified">✅ Qualified</option>
                        <option value="converted">🎉 Converted</option>
                        <option value="lost">❌ Lost</option>
                      </select>
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-8 py-5">
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        📅 {formatDate(lead.createdAt)}
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        disabled={deletingId === lead.id}
                        className="inline-flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium whitespace-nowrap"
                      >
                        <IoTrash className="w-3 h-3 mr-1" />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              📊 Hiển thị{" "}
              <span className="font-medium text-blue-600">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium text-blue-600">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              trên{" "}
              <span className="font-medium text-blue-600">
                {pagination.total}
              </span>{" "}
              leads
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200"
              >
                ← Trước
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-blue-700">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.totalPages, currentPage + 1)
                  )
                }
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 hover:border-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-gray-200"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && leadToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <IoTrash className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Xác nhận xóa
                  </h3>
                </div>
                <button
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  ⚠️ Bạn có chắc chắn muốn xóa lead này không? Hành động này
                  không thể hoàn tác.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar name={leadToDelete.lead_name} />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {leadToDelete.lead_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        📧 {leadToDelete.lead_email}
                      </div>
                      {leadToDelete.lead_company && (
                        <div className="text-sm text-gray-600">
                          🏢 {leadToDelete.lead_company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300 font-medium"
                >
                  ❌ Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === leadToDelete.id}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {deletingId === leadToDelete.id
                    ? "🗑️ Đang xóa..."
                    : "🗑️ Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
