import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-10 lg:pt-36 lg:pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-100/40 via-violet-100/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 leading-[1.15] tracking-tight">
              Học thông minh hơn với lộ trình từ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Mentor thực chiến
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Khám phá phương pháp học tập tối ưu thông qua checklists, quizzes
              và kinh nghiệm quý báu từ các chuyên gia hàng đầu trong ngành.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <a href="#roadmaps">
                <Button variant="secondary" size="lg">
                  Khám phá roadmap
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  'bg-gradient-to-br from-indigo-400 to-indigo-600',
                  'bg-gradient-to-br from-violet-400 to-violet-600',
                  'bg-gradient-to-br from-blue-400 to-blue-600',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full ${bg} border-2 border-white flex items-center justify-center`}
                  >
                    <Users className="w-4 h-4 text-white" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  <span className="text-indigo-600">10k+</span> learners đã tham gia
                </p>
              </div>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/50 to-violet-200/50 rounded-3xl blur-2xl scale-105" />
              <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200/60 shadow-2xl shadow-indigo-100/50 p-8 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                      <div className="h-2 bg-slate-100 rounded-full w-1/2 mt-2" />
                    </div>
                  </div>
                  <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-indigo-700">Progress</span>
                      <span className="text-sm font-bold text-indigo-600">78%</span>
                    </div>
                    <div className="h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { emoji: '🎯', label: '12 Tasks', color: 'bg-green-50 border-green-100' },
                      { emoji: '⏱️', label: '48h Learn', color: 'bg-blue-50 border-blue-100' },
                      { emoji: '🏆', label: '3 Badges', color: 'bg-amber-50 border-amber-100' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`${stat.color} rounded-xl p-3 border text-center`}
                      >
                        <span className="text-xl">{stat.emoji}</span>
                        <p className="text-xs font-medium text-slate-600 mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-sm">✓</div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Checkpoint hoàn thành!</p>
                      <p className="text-xs text-green-600">React Fundamentals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
