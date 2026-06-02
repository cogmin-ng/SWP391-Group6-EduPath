import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  Lightbulb,
  Lock,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function HomeView({
  user,
  courses,
  activities,
  badges,
  suggestedCourses,
  onEnrollGame,
  onPlaceholderClick,
  onUpdateXp,
}) {
  const handlePlaceholder = onPlaceholderClick ?? (() => {});
  const [welcomeTip, setWelcomeTip] = useState(
    '"Mỗi dòng code bạn viết hôm nay là một bước đệm vững chắc cho sự nghiệp tương lai!"',
  );

  const tipsArray = [
    '"Mỗi dòng code viết ra hôm nay đều giúp bạn trở nên lão luyện hơn ngày hôm qua!"',
    '"Sự nhất quán quan trọng hơn tốc độ. Học 30 phút mỗi ngày tốt hơn học 5 tiếng vào ngày cuối tuần! 🚀"',
    '"Đừng chỉ đọc code. Hãy trực tiếp viết code và thử bẻ gãy nó để hiểu thực chất luồng vận hành! 💡"',
    '"Mỗi lỗi cú pháp là một bài học đắt giá giúp bạn debug nhanh hơn ở các dự án phức tạp! ✨"',
    '"Docker giúp cô lập tài nguyên sạch sẽ. Đừng ngại thử nghiệm các container mới nhé! 🛡️"',
    '"UI/UX tốt là sự giao thoa hoàn hảo giữa cảm xúc khách hàng và thẩm mỹ tối giản! 🎨"',
  ];

  const generateNewEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * tipsArray.length);
    setWelcomeTip(tipsArray[randomIndex]);
    onUpdateXp(5, "Đã nhận tips truyền cảm hứng từ EduPath");
  };

  const activeEnrolled = courses.filter((c) => c.isEnrolled);

  return (
    <div
      id="home_view_container"
      className="w-full space-y-6 sm:space-y-7 lg:space-y-8"
    >
      <div className="relative overflow-hidden bg-[#635BFF] rounded-3xl text-white p-5 sm:p-6 md:p-8 shadow-xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-[30%] bottom-[-20%] w-56 h-56 rounded-full bg-violet-400/20 blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>EduPath Dashboard • Level {user.level}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-display tracking-tight md:text-4xl">
                Chào lại, {user.name} 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Hôm nay là một ngày tuyệt vời để học hỏi và phát triển bản thân.
                Trình duyệt tài liệu học tập của bạn luôn sẵn sàng!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-3 text-xs md:text-sm italic text-blue-50/90 flex justify-between items-center gap-3">
              <span>{welcomeTip}</span>
              <button
                id="btn_new_encouragement"
                onClick={generateNewEncouragement}
                className="shrink-0 bg-white/20 hover:bg-white/30 text-white font-medium py-1 px-2.5 rounded-lg text-xs transition duration-200"
              >
                Tạo cảm hứng ⚡
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-2">
              <button
                id="btn_banner_continue"
                onClick={handlePlaceholder}
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-indigo-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-1.5 shadow-md"
              >
                Tiếp tục học
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn_banner_catalog"
                onClick={handlePlaceholder}
                className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white/30 hover:border-white text-white font-medium py-2.5 px-5 rounded-xl text-sm transition duration-200"
              >
                Xem lộ trình của tôi
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
            <div className="relative w-full max-w-105 h-60 bg-slate-900/30 rounded-2xl flex items-center justify-center border border-white/10">
              <div className="absolute w-40 h-27.5 bg-indigo-950/70 border border-indigo-400/30 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute top-1 left-2 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="text-left font-mono text-[8px] text-indigo-300 space-y-1 p-2">
                  <p className="text-yellow-400">const course = "EduPath";</p>
                  <p className="text-sky-300">
                    import {"{ React }"} from "packages";
                  </p>
                  <p className="text-emerald-400">
                    console.log("Welcome Back!");
                  </p>
                </div>
              </div>
              <div className="absolute w-45 h-8.75 border-[3px] border-violet-400/50 rounded-full rotate-[-15deg] animate-pulse" />
              <div className="absolute right-4 bottom-4 w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="absolute left-[15%] bottom-[5%] w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="stats_cards_grid"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5"
      >
        <div
          id="stat_card_courses"
          onClick={handlePlaceholder}
          className="min-h-38 bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-100 p-4 rounded-2xl shadow-sm cursor-pointer transition duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
              Lộ trình
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-slate-500 font-medium">
              Lộ trình đang học
            </p>
            <h3 className="text-2xl font-bold font-display text-slate-800">
              {activeEnrolled.length}
            </h3>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 group-hover:text-blue-600 transition">
            <span>Xem chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 transition duration-200 group-hover:translate-x-1" />
          </div>
        </div>

        <div
          id="stat_card_average"
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              Tỷ lệ
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-slate-500 font-medium">
              Tiến độ trung bình
            </p>
            <h3 className="text-2xl font-bold font-display text-slate-800">
              {Math.round(
                activeEnrolled.reduce((acc, c) => acc + c.progress, 0) /
                  (activeEnrolled.length || 1),
              )}
              %
            </h3>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] text-emerald-600 font-medium">
            <span className="flex items-center gap-0.5">Cải thiện 12% 📈</span>
          </div>
        </div>

        <div
          id="stat_card_xp"
          onClick={handlePlaceholder}
          className="min-h-38 bg-white hover:bg-slate-50 border border-slate-100 hover:border-amber-100 p-4 rounded-2xl shadow-sm cursor-pointer transition duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition duration-300">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-amber-600 font-semibold uppercase bg-amber-50 px-2 py-0.5 rounded-full">
              Kinh nghiệm
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Tổng XP</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">
              2,450
            </h3>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 group-hover:text-amber-600 transition">
            <span>Xem thành tích</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 transition duration-200 group-hover:translate-x-1" />
          </div>
        </div>

        <div
          id="stat_card_certificates"
          onClick={handlePlaceholder}
          className="min-h-38 bg-white hover:bg-slate-50 border border-slate-100 hover:border-violet-100 p-4 rounded-2xl shadow-sm cursor-pointer transition duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-violet-50 group-hover:bg-violet-100 flex items-center justify-center text-violet-600 transition duration-300">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-violet-600 font-semibold uppercase bg-violet-50 px-2 py-0.5 rounded-full">
              Hồ sơ
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-slate-500 font-medium">
              Chứng chỉ đã nhận
            </p>
            <h3 className="text-2xl font-bold font-display text-slate-800">
              4
            </h3>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-500 group-hover:text-violet-600 transition">
            <span>Xem chứng chỉ</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 transition duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-8">
        <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Tiếp tục học tập
        </h2>
        <button
          id="btn_view_all_learning"
          onClick={handlePlaceholder}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          Xem tất cả
        </button>
      </div>

      <div
        id="continue_learning_hero"
        className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 items-center">
          <div className="xl:col-span-4 relative h-40 sm:h-44 xl:h-full w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 flex items-center justify-center min-h-55">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80')",
              }}
            />
            <span className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Đang học
            </span>
          </div>

          <div className="xl:col-span-8 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-display text-slate-800">
                Fullstack Web Development
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <span>Bộ khung: Node.js & Express.js</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  Tiến trình học tập
                </span>
                <span className="font-bold text-indigo-600">72%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100/30 text-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Node hiện tại
                </p>
                <p className="font-bold text-indigo-900 mt-0.5">
                  API & Authentication
                </p>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium bg-white border border-indigo-100 px-2.5 py-1 rounded-full">
                Sắp hoàn thành ✨
              </span>
            </div>

            <div className="flex gap-3">
              <button
                id="btn_continue_fullstack"
                onClick={handlePlaceholder}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transition duration-200 flex items-center justify-center gap-1.5"
              >
                Tiếp tục học
              </button>
              <button
                id="btn_view_roadmap_fullstack"
                onClick={handlePlaceholder}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-800 border border-slate-200/80 font-medium py-2.5 rounded-xl text-xs sm:text-sm transition duration-200 flex items-center justify-center gap-1"
              >
                Xem roadmap
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <h3 className="text-base font-bold font-display text-slate-800">
          Truy cập nhanh
        </h3>
        <div
          id="quick_access_grid"
          className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5"
        >
          <div
            id="quick_acc_path"
            onClick={handlePlaceholder}
            className="bg-white hover:bg-blue-50 border border-blue-200/80 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition duration-200 group flex flex-col items-center justify-center space-y-2.5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Lộ trình của tôi
              </p>
              <p className="text-xs text-slate-500 mt-1">Tiến độ và học tập</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            id="quick_acc_node"
            onClick={handlePlaceholder}
            className="bg-white hover:bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition duration-200 group flex flex-col items-center justify-center space-y-2.5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Học tập (Node View)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Tài liệu, checklist & tips
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            id="quick_acc_quiz"
            onClick={handlePlaceholder}
            className="bg-white hover:bg-amber-50 border border-amber-200/80 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition duration-200 group flex flex-col items-center justify-center space-y-2.5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">Làm Quiz</p>
              <p className="text-xs text-slate-500 mt-1">
                Luyện đề và tích luỹ XP
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            id="quick_acc_tip"
            onClick={handlePlaceholder}
            className="bg-white hover:bg-red-50 border border-red-200/80 rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition duration-200 group flex flex-col items-center justify-center space-y-2.5 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 shadow-inner">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Đóng góp Tip-tricks
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Chia sẻ mẹo lập trình
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-display text-slate-800">
            Lộ trình của tôi
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Học song hành nhiều chủ đề
          </span>
        </div>

        <div
          id="my_courses_horizontal_list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {activeEnrolled.map((course) => (
            <div
              key={course.id}
              id={`course_card_${course.id}`}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
            >
              <div>
                <div className="relative h-28 bg-slate-900 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      course.level === "Advanced"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : course.level === "Intermediate"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Tutor: {course.tutor}
                  </p>
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Tiến độ</span>
                      <span className="font-bold text-slate-800">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100">
                <button
                  id={`btn_goto_course_${course.id}`}
                  onClick={handlePlaceholder}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 text-xs rounded-xl font-semibold transition"
                >
                  Tiếp tục học
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
        <div className="xl:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold font-display text-slate-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động gần đây
            </h3>
            <button
              onClick={handlePlaceholder}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Xem tất cả
            </button>
          </div>

          <div
            id="home_activity_feed"
            className="bg-white border border-slate-100 rounded-2xl p-4 divide-y divide-slate-100 shadow-sm space-y-3.5"
          >
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                Chưa có hoạt động nào được ghi nhận.
              </p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="pt-3.5 first:pt-0 flex items-start gap-3"
                >
                  <div
                    className={`mt-0.5 w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 ${
                      act.iconType === "check"
                        ? "bg-emerald-50 text-emerald-600"
                        : act.iconType === "quiz"
                          ? "bg-blue-50 text-blue-600"
                          : act.iconType === "tip"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {act.iconType === "check" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : act.iconType === "quiz" ? (
                      <HelpCircle className="w-4 h-4" />
                    ) : act.iconType === "tip" ? (
                      <Lightbulb className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] text-slate-400 block">
                      {act.timeAgo}
                    </span>
                    {act.xpGained > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                        +{act.xpGained} XP
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="xl:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold font-display text-slate-800">
              Thành tích của bạn
            </h3>
            <button
              onClick={handlePlaceholder}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Xem tất cả
            </button>
          </div>

          <div
            id="home_achievements_panel"
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4"
          >
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100/50 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full bg-indigo-600 shadow-md flex items-center justify-center text-white shrink-0">
                <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  Consistent Learner
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Duy trì học tập liên tục {user.streakDays} ngày
                </p>
                <span className="text-[10px] font-bold text-indigo-600 mt-1 block">
                  +100 XP Đã nhận
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Huy hiệu mới nhất
              </p>
              <div
                id="latest_badges_row"
                className="flex items-center gap-3 flex-wrap"
              >
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border transition relative group cursor-pointer shrink-0 ${
                      badge.isUnlocked
                        ? "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100"
                        : "bg-slate-50 text-slate-300 border-slate-100"
                    }`}
                  >
                    {badge.iconName === "award" ? (
                      <Award className="w-5 h-5" />
                    ) : badge.iconName === "star" ? (
                      <Star className="w-5 h-5" />
                    ) : badge.iconName === "zap" ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-[10px] rounded-lg p-2 opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 shadow-lg text-center">
                      <strong className="block">{badge.title}</strong>
                      {badge.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="suggested_courses_section" className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold font-display text-slate-800">
            Đề xuất dành cho bạn
          </h3>
          <button
            onClick={handlePlaceholder}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Xem tất cả
          </button>
        </div>

        <div
          id="suggestion_course_cards_grid"
          className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-5"
        >
          {suggestedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group min-h-80"
            >
              <div>
                <div className="relative h-28 bg-slate-900 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{course.rating || "4.8"}</span>
                  </div>
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      course.level === "Advanced"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : course.level === "Intermediate"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-800 tracking-tight group-hover:text-indigo-600 transition line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {course.learners || "1k+ học viên"} • Hướng dẫn bởi{" "}
                    {course.tutor}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  id={`btn_enroll_sugg_${course.id}`}
                  onClick={() => onEnrollGame(course.id)}
                  className="w-full bg-indigo-50 hover:bg-indigo-600 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white py-2.5 rounded-xl text-xs font-semibold transition duration-200"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
