import { useNavigate } from 'react-router-dom';
import { myRoadmaps } from '../../mock/mentorDashboardData';

export default function MentorRoadmapsPage() {
  const navigate = useNavigate();

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}`);
  };

  const handleLearnRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/learn`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lộ trình của tôi</h1>
        <p className="text-slate-500 mt-2">
          Quản lý và phát triển các chương trình đào tạo của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {myRoadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
          >
            <div>
              <div className="relative h-28 bg-slate-900 overflow-hidden">
                <img
                  src={roadmap.image}
                  alt={roadmap.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    roadmap.level === "Advanced"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : roadmap.level === "Intermediate"
                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                  }`}
                >
                  {roadmap.level}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                  {roadmap.title}
                </h4>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleViewRoadmap(roadmap.id)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
              >
                Xem
              </button>
              <button
                onClick={() => handleLearnRoadmap(roadmap.id)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
              >
                Xem lộ trình
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
