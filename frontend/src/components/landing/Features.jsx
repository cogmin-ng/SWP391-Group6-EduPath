import { BookOpen, Award, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Lộ trình rõ ràng',
    description:
      'Học theo từng bước được thiết kế bởi các chuyên gia trong ngành.',
  },
  {
    icon: Award,
    title: 'Nhận chứng chỉ',
    description:
      'Chứng minh năng lực của bạn với chứng chỉ sau khi hoàn thành.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Mentor hỗ trợ',
    description:
      'Kết nối và nhận phản hồi trực tiếp từ những người đi trước.',
  },
];

export default function Features() {
  return (
    <section className="py-12 lg:py-20 bg-white relative overflow-hidden">
      {/* Optional global background accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tại sao chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">EduPath?</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Hành trình học tập của bạn được thiết kế với sự đồng hành của chuyên gia, chứng chỉ uy tín và lộ trình bài bản.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative overflow-hidden group bg-indigo-600 rounded-[2rem] p-8 border border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Decorative Blur Blob */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/20" />
              
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white/10">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="relative z-10 text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative z-10 text-indigo-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
