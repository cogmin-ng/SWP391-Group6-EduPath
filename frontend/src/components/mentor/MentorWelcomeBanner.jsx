import { Plus } from 'lucide-react';

const MentorWelcomeBanner = ({ onCreateNew }) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-8 md:p-12 mb-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <p className="text-indigo-200 text-sm font-medium mb-2">📅 {formattedDate}</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Xin chào, Nguyễn Văn A
          </h1>
          <p className="text-indigo-100 text-lg">
            Chào mừng bạn quay trở lại EduPath. Tiếp tục xây dựng những lộ trình học tập chất lượng cho cộng đồng học viên.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Tạo Lộ Trình Mới
        </button>
      </div>
    </div>
  );
};

export default MentorWelcomeBanner;
