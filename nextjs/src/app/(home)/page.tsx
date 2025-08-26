"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import {
  IoDocumentText,
  IoCloudUpload,
  IoShield,
  IoSearch,
  IoShare,
  IoAnalytics,
} from "react-icons/io5";
import { HiUsers, HiLightningBolt, HiCheckCircle } from "react-icons/hi";

export default function Home() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chào mừng trở lại, {user?.user_firstName}! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Quản lý tài liệu của bạn một cách hiệu quả
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Link
                href="/documents"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <IoDocumentText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tài liệu của tôi</h3>
                <p className="text-gray-600">Xem và quản lý tất cả tài liệu</p>
              </Link>

              <Link
                href="/upload"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <IoCloudUpload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tải lên</h3>
                <p className="text-gray-600">Thêm tài liệu mới</p>
              </Link>

              <Link
                href="/analytics"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <IoAnalytics className="w-12 h-12 text-blue-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Thống kê</h3>
                <p className="text-gray-600">Xem báo cáo và phân tích</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Quản lý tài liệu
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
              thông minh & hiệu quả
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nền tảng quản lý tài liệu hiện đại giúp bạn lưu trữ, tổ chức và chia
            sẻ tài liệu một cách an toàn và thuận tiện.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những tính năng mạnh mẽ giúp tối ưu hóa quy trình làm việc
            của bạn
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6">
              <IoCloudUpload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Upload dễ dàng</h3>
            <p className="text-gray-600">
              Kéo thả file hoặc chọn từ thiết bị. Hỗ trợ nhiều định dạng file
              phổ biến.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <IoSearch className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Tìm kiếm thông minh</h3>
            <p className="text-gray-600">
              Tìm kiếm nhanh chóng với AI, lọc theo loại file, ngày tạo và nhiều
              tiêu chí khác.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-6">
              <IoShare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Chia sẻ an toàn</h3>
            <p className="text-gray-600">
              Chia sẻ tài liệu với đồng nghiệp, kiểm soát quyền truy cập và theo
              dõi hoạt động.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-300 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <IoShield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Bảo mật cao</h3>
            <p className="text-gray-600">
              Mã hóa end-to-end, backup tự động và tuân thủ các tiêu chuẩn bảo
              mật quốc tế.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <HiUsers className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Cộng tác nhóm</h3>
            <p className="text-gray-600">
              Làm việc nhóm hiệu quả với comment, review và phê duyệt tài liệu
              trực tuyến.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-700 rounded-xl flex items-center justify-center mb-6">
              <HiLightningBolt className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Hiệu suất cao</h3>
            <p className="text-gray-600">
              Truy cập nhanh chóng, đồng bộ realtime và hoạt động mượt mà trên
              mọi thiết bị.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Người dùng tin tưởng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-lg opacity-90">Tài liệu được quản lý</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Thời gian hoạt động</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người dùng đang sử dụng nền tảng của chúng
            tôi để quản lý tài liệu hiệu quả hơn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Đăng ký miễn phí ngay
            </Link>
            <div className="flex items-center text-gray-600">
              <HiCheckCircle className="w-5 h-5 text-blue-500 mr-2" />
              <span>Không cần thẻ tín dụng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
