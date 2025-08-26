const stats = [
  {
    number: "50K+",
    label: "Người dùng tin tưởng",
  },
  {
    number: "1M+",
    label: "Tài liệu được quản lý",
  },
  {
    number: "99.9%",
    label: "Thời gian hoạt động",
  },
];

export default function StatsSection() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
