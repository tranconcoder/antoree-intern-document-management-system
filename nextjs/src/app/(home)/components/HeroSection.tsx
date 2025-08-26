import Link from "next/link";

export default function HeroSection() {
  return (
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
  );
}
