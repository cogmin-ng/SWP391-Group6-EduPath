import { useState } from 'react';
import { Star, Users, ArrowRight } from 'lucide-react';

const categories = [
  'Tất cả',
  'Programming',
  'Design',
  'AI',
  'Data Science',
  'Marketing',
];

const roadmaps = [
  {
    id: 1,
    title: 'Fullstack Web Development',
    author: 'Alex Johnson',
    rating: 4.8,
    students: '2.5k',
    modules: 120,
    level: 'Beginner',
    levelColor: 'bg-green-100 text-green-700',
    category: 'Programming',
    gradient: 'from-slate-700 to-slate-900',
    emoji: '💻',
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    author: 'Sarah Chen',
    rating: 4.9,
    students: '1.8k',
    modules: 85,
    level: 'Intermediate',
    levelColor: 'bg-amber-100 text-amber-700',
    category: 'Design',
    gradient: 'from-violet-500 to-purple-700',
    emoji: '🎨',
  },
  {
    id: 3,
    title: 'Data Science for Everyone',
    author: 'David Miller',
    rating: 4.7,
    students: '3.2k',
    modules: 90,
    level: 'Beginner',
    levelColor: 'bg-green-100 text-green-700',
    category: 'Data Science',
    gradient: 'from-blue-500 to-cyan-600',
    emoji: '📊',
  },
  {
    id: 4,
    title: 'Advanced AI Engineering',
    author: 'Dr. Emily White',
    rating: 5.0,
    students: '900+',
    modules: 150,
    level: 'Advanced',
    levelColor: 'bg-red-100 text-red-700',
    category: 'AI',
    gradient: 'from-indigo-600 to-blue-800',
    emoji: '🤖',
  },
];

export default function FeaturedRoadmaps() {
  const [active, setActive] = useState('Tất cả');

  const filtered =
    active === 'Tất cả'
      ? roadmaps
      : roadmaps.filter((r) => r.category === active);

  return (
    <section id="roadmaps" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Lộ trình học tập nổi bật
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Chọn lộ trình phù hợp để bắt đầu hành trình sự nghiệp của bạn.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                active === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((roadmap) => (
            <div
              key={roadmap.id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Image */}
              <div
                className={`relative h-44 bg-gradient-to-br ${roadmap.gradient} flex items-center justify-center`}
              >
                <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {roadmap.emoji}
                </span>
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold ${roadmap.levelColor}`}
                >
                  {roadmap.level}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {roadmap.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2">{roadmap.author}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      {roadmap.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{roadmap.students}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {roadmap.modules} bài
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 hover:gap-3 transition-all duration-200"
          >
            Xem tất cả lộ trình
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
