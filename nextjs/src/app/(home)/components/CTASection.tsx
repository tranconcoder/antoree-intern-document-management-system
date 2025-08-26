import Link from "next/link";
import { HiCheckCircle } from "react-icons/hi";

export default function CTASection() {
  return (
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
  );
}
