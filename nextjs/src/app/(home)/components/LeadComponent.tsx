"use client";

import React, { useState, useEffect } from "react";
import {
  IoSend,
  IoCheckmarkCircle,
  IoClose,
  IoWarning,
  IoAlertCircle,
} from "react-icons/io5";
import axios from "@/services/axios.service";

interface LeadFormData {
  lead_name: string;
  lead_email: string;
  lead_phone?: string;
  lead_company?: string;
  lead_message?: string;
}

export default function LeadComponent() {
  const [formData, setFormData] = useState<LeadFormData>({
    lead_name: "",
    lead_email: "",
    lead_phone: "",
    lead_company: "",
    lead_message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | "warning"
  >("success");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate name
    if (!formData.lead_name.trim()) {
      errors.lead_name = "Vui lòng nhập họ và tên";
    } else if (formData.lead_name.trim().length < 2) {
      errors.lead_name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    if (!formData.lead_email.trim()) {
      errors.lead_email = "Vui lòng nhập địa chỉ email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.lead_email)) {
        errors.lead_email = "Địa chỉ email không hợp lệ";
      }
    }

    // Validate phone (optional but if provided, should be valid)
    if (formData.lead_phone && formData.lead_phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
      if (!phoneRegex.test(formData.lead_phone.replace(/\s/g, ""))) {
        errors.lead_phone = "Số điện thoại không hợp lệ";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      setNotificationType("warning");
      setError("Vui lòng kiểm tra và điền đầy đủ thông tin hợp lệ");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setError("");
      }, 5000);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setShowNotification(false);
    setFieldErrors({});

    try {
      const response = await axios.post("/leads", formData);
      console.log("Response:", response); // Debug log

      // Check if response is successful (status 200-299) or has success flag
      if (response.status >= 200 && response.status < 300) {
        console.log("Success detected!"); // Debug log

        // Save submitted data before resetting form
        setSubmittedData({ ...formData });

        // Show success feedback
        setIsSuccess(true);
        setNotificationType("success");
        setShowNotification(true);

        // Reset form
        setFormData({
          lead_name: "",
          lead_email: "",
          lead_phone: "",
          lead_company: "",
          lead_message: "",
        });

        // Show success message with vibration (if supported)
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        // Auto hide notification after 6 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 6000);

        // Auto hide modal after 8 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 8000);
      }
    } catch (err: any) {
      setNotificationType("error");
      setShowNotification(true);

      if (err.response?.status === 429) {
        setError(
          "Email này đã gửi đủ 3 lần trong ngày hôm nay. Vui lòng thử lại vào ngày mai hoặc sử dụng email khác."
        );
      } else if (err.response?.status === 409) {
        setError(
          "Email này đã được gửi trước đó. Vui lòng sử dụng email khác."
        );
      } else if (err.response?.status >= 500) {
        setError("Lỗi hệ thống. Vui lòng thử lại sau ít phút.");
      } else {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
        );
      }

      // Auto hide error notification after 7 seconds
      setTimeout(() => {
        setShowNotification(false);
        setError("");
      }, 7000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    setShowNotification(false);
  };

  const closeNotification = () => {
    setShowNotification(false);
    setError("");
  };

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hãy để lại thông tin để được tư vấn miễn phí về hệ thống quản lý tài
            liệu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Tại sao chọn chúng tôi?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <IoCheckmarkCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tư vấn miễn phí
                    </h4>
                    <p className="text-gray-600">
                      Đội ngũ chuyên gia giàu kinh nghiệm
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <IoCheckmarkCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Giải pháp tùy chỉnh
                    </h4>
                    <p className="text-gray-600">
                      Phù hợp với nhu cầu doanh nghiệp
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <IoCheckmarkCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hỗ trợ 24/7</h4>
                    <p className="text-gray-600">
                      Đội ngũ kỹ thuật luôn sẵn sàng
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <IoCheckmarkCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Bảo mật cao</h4>
                    <p className="text-gray-600">
                      Dữ liệu được bảo vệ tuyệt đối
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">
                Thông tin liên hệ
              </h4>
              <div className="space-y-3 text-gray-600">
                <p>📧 Email: support@antoree.com</p>
                <p>📱 Hotline: 1900-xxxx</p>
                <p>🏢 Văn phòng: Hà Nội, Việt Nam</p>
                <p>🕒 Giờ làm việc: 8:00 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="lead_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="lead_name"
                  name="lead_name"
                  required
                  value={formData.lead_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500 ${
                    fieldErrors.lead_name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                />
                {fieldErrors.lead_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <IoAlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.lead_name}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lead_email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="lead_email"
                  name="lead_email"
                  required
                  value={formData.lead_email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500 ${
                    fieldErrors.lead_email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập địa chỉ email"
                />
                {fieldErrors.lead_email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <IoAlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.lead_email}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lead_phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="lead_phone"
                  name="lead_phone"
                  value={formData.lead_phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500 ${
                    fieldErrors.lead_phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                {fieldErrors.lead_phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <IoAlertCircle className="w-4 h-4" />
                    <span>{fieldErrors.lead_phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lead_company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Công ty/Tổ chức
                </label>
                <input
                  type="text"
                  id="lead_company"
                  name="lead_company"
                  value={formData.lead_company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500"
                  placeholder="Nhập tên công ty (nếu có)"
                />
              </div>

              <div>
                <label
                  htmlFor="lead_message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Lời nhắn
                </label>
                <textarea
                  id="lead_message"
                  name="lead_message"
                  rows={4}
                  value={formData.lead_message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder-gray-500"
                  placeholder="Hãy cho chúng tôi biết nhu cầu của bạn..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <IoAlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">
                        Gửi thất bại!
                      </h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang gửi thông tin...</span>
                  </>
                ) : (
                  <>
                    <IoSend className="w-5 h-5" />
                    <span>Gửi thông tin liên hệ</span>
                  </>
                )}
              </button>

              {/* Form submission note */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Mỗi email chỉ có thể gửi tối đa <strong>3 lần</strong> trong 1
                  ngày
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Toast Notifications */}
        {showNotification && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ease-in-out ${
              showNotification
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div
              className={`rounded-xl shadow-lg border-l-4 p-4 ${
                notificationType === "success"
                  ? "bg-green-50 border-green-500"
                  : notificationType === "error"
                  ? "bg-red-50 border-red-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notificationType === "success" && (
                    <IoCheckmarkCircle className="w-6 h-6 text-green-600" />
                  )}
                  {notificationType === "error" && (
                    <IoAlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  {notificationType === "warning" && (
                    <IoWarning className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      notificationType === "success"
                        ? "text-green-900"
                        : notificationType === "error"
                        ? "text-red-900"
                        : "text-yellow-900"
                    }`}
                  >
                    {notificationType === "success" && "Gửi thành công!"}
                    {notificationType === "error" && "Gửi thất bại!"}
                    {notificationType === "warning" && "Cảnh báo!"}
                  </h4>
                  <p
                    className={`mt-1 text-sm ${
                      notificationType === "success"
                        ? "text-green-700"
                        : notificationType === "error"
                        ? "text-red-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {notificationType === "success"
                      ? `Thông tin đã được gửi thành công! Chúng tôi sẽ liên hệ với ${
                          submittedData?.lead_name || "bạn"
                        } qua email ${
                          submittedData?.lead_email || ""
                        } trong vòng 24 giờ.`
                      : error}
                  </p>
                </div>
                <button
                  onClick={closeNotification}
                  className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                    notificationType === "success"
                      ? "text-green-400 hover:text-green-600"
                      : notificationType === "error"
                      ? "text-red-400 hover:text-red-600"
                      : "text-yellow-400 hover:text-yellow-600"
                  }`}
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {isSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-lg mx-4 text-center transform animate-scaleIn shadow-2xl">
              {/* Success Icon with Animation */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <IoCheckmarkCircle className="w-12 h-12 text-green-600" />
              </div>

              {/* Success Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🎉 Gửi thành công!
              </h3>

              {/* Success Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cảm ơn <strong>{submittedData?.lead_name || "bạn"}</strong> đã
                liên hệ với chúng tôi! Chúng tôi sẽ phản hồi đến email{" "}
                <strong>{submittedData?.lead_email}</strong> trong vòng 24 giờ.
              </p>

              {/* Additional Info */}
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📋 Thông tin đã gửi:
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Họ tên: {submittedData?.lead_name}</p>
                    <p>• Email: {submittedData?.lead_email}</p>
                    {submittedData?.lead_phone && (
                      <p>• Điện thoại: {submittedData.lead_phone}</p>
                    )}
                    {submittedData?.lead_company && (
                      <p>• Công ty: {submittedData.lead_company}</p>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Lưu ý:</strong> Mỗi email chỉ có thể gửi tối đa 3
                    lần trong 1 ngày.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={closeSuccess}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Đóng
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Gửi thêm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
