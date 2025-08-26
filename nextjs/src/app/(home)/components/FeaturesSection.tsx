import { IoCloudUpload, IoShield, IoSearch, IoShare } from "react-icons/io5";
import { HiUsers, HiLightningBolt } from "react-icons/hi";

const features = [
  {
    icon: IoCloudUpload,
    title: "Upload dễ dàng",
    description:
      "Kéo thả file hoặc chọn từ thiết bị. Hỗ trợ nhiều định dạng file phổ biến.",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: IoSearch,
    title: "Tìm kiếm thông minh",
    description:
      "Tìm kiếm nhanh chóng với AI, lọc theo loại file, ngày tạo và nhiều tiêu chí khác.",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    icon: IoShare,
    title: "Chia sẻ an toàn",
    description:
      "Chia sẻ tài liệu với đồng nghiệp, kiểm soát quyền truy cập và theo dõi hoạt động.",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    icon: IoShield,
    title: "Bảo mật cao",
    description:
      "Mã hóa end-to-end, backup tự động và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
    gradient: "from-blue-300 to-blue-500",
  },
  {
    icon: HiUsers,
    title: "Cộng tác nhóm",
    description:
      "Làm việc nhóm hiệu quả với comment, review và phê duyệt tài liệu trực tuyến.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: HiLightningBolt,
    title: "Hiệu suất cao",
    description:
      "Truy cập nhanh chóng, đồng bộ realtime và hoạt động mượt mà trên mọi thiết bị.",
    gradient: "from-blue-400 to-blue-700",
  },
];

export default function FeaturesSection() {
  return (
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
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}
              >
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
