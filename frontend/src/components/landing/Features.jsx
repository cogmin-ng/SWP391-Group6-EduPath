import { BookOpen, Award, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Lộ trình rõ ràng',
    description:
      'Học theo từng bước được thiết kế bởi các chuyên gia trong ngành.',
    color: 'bg-indigo-50 text-indigo-600',
    borderColor: 'border-indigo-100',
  },
  {
    icon: Award,
    title: 'Nhận chứng chỉ',
    description:
      'Chứng minh năng lực của bạn với chứng chỉ sau khi hoàn thành.',
    color: 'bg-violet-50 text-violet-600',
    borderColor: 'border-violet-100',
  },
  {
    icon: HeadphonesIcon,
    title: 'Mentor hỗ trợ',
    description:
      'Kết nối và nhận phản hồi trực tiếp từ những người đi trước.',
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-100',
  },
];

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Tại sao chọn EduPath?
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group bg-white rounded-2xl p-7 border ${feature.borderColor} hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
