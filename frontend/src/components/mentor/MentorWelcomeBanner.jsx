import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Layers, Plus, Sparkles, Terminal } from 'lucide-react';

const MentorWelcomeBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [welcomeTip, setWelcomeTip] = useState(
    '"Một người thầy giỏi là người biết truyền cảm hứng, khơi dậy niềm đam mê học hỏi của học viên."'
  );

  const tipsArray = [
    '"Kiến thức chia sẻ là kiến thức được nhân đôi. Lộ trình của bạn là ngọn hải đăng cho học viên! 💡"',
    '"Thiết kế bài học có tính thực chiến cao sẽ giúp học viên dễ tiếp thu hơn các lý thuyết suông! 🚀"',
    '"Đừng quên duyệt qua các Tip-tricks đóng góp từ cộng đồng để làm phong phú thêm bài học! ✨"',
    '"Một lộ trình logic từ cơ bản đến nâng cao là chìa khóa giúp học viên không bị ngợp! 🛡️"',
    '"Hãy luôn cập nhật những xu hướng công nghệ mới nhất vào lộ trình học tập của mình! 🎨"',
  ];

  const generateNewTip = () => {
    const randomIndex = Math.floor(Math.random() * tipsArray.length);
    setWelcomeTip(tipsArray[randomIndex]);
  };

  const displayName = user?.name || 'Mentor';

  return (
    <div className="relative overflow-hidden bg-[#635BFF] rounded-3xl text-white p-5 sm:p-6 md:p-8 shadow-xl mb-8">
      {/* Decorative Glows */}
      <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute left-[30%] bottom-[-20%] w-56 h-56 rounded-full bg-violet-400/20 blur-2xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>EduPath Mentor Portal • Bảng điều khiển</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-display tracking-tight md:text-4xl">
              Chào lại, {displayName} 👋
            </h1>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Chào mừng bạn quay trở lại. Hãy cùng xây dựng, đóng góp kiến thức và phát triển những lộ trình học tập tối ưu nhất cho cộng đồng học viên nhé!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-3 text-xs md:text-sm italic text-blue-50/90 flex justify-between items-center gap-3">
            <span>{welcomeTip}</span>
            <button
              onClick={generateNewTip}
              className="shrink-0 bg-white/20 hover:bg-white/30 text-white font-medium py-1 px-2.5 rounded-lg text-xs transition duration-200"
            >
              Tạo cảm hứng ⚡
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('/mentor/create-roadmap')}
              className="w-full sm:w-auto bg-white hover:bg-blue-50 text-indigo-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tạo lộ trình mới
            </button>
            <button
              onClick={() => navigate('/mentor/roadmaps')}
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white/30 hover:border-white text-white font-medium py-2.5 px-5 rounded-xl text-sm transition duration-200 cursor-pointer"
            >
              Quản lý lộ trình
            </button>
          </div>
        </div>

        {/* Decorative Right Side Visual */}
        <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
          <div className="relative w-full max-w-105 h-60 bg-slate-900/30 rounded-2xl flex items-center justify-center border border-white/10">
            <div className="absolute w-40 h-27.5 bg-indigo-950/70 border border-indigo-400/30 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute top-1 left-2 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
              <div className="text-left font-mono text-[8px] text-indigo-300 space-y-1 p-2">
                <p className="text-yellow-400">const role = "MENTOR";</p>
                <p className="text-sky-300">
                  import {"{ CreateRoadmap }"} from "edupath";
                </p>
                <p className="text-emerald-400">
                  console.log("Guide the next gen!");
                </p>
              </div>
            </div>
            <div className="absolute w-45 h-8.75 border-[3px] border-violet-400/50 rounded-full rotate-[-15deg] animate-pulse" />
            <div className="absolute right-4 bottom-4 w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Layers className="w-6 h-6" />
            </div>
            <div className="absolute left-[15%] bottom-[5%] w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorWelcomeBanner;
