import { Plus, Lightbulb } from 'lucide-react';

const TipsSection = ({ tips }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Kinh nghiệm & Bí kíp</h2>
        </div>
        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Thêm Tip
        </button>
      </div>

      {/* Tips List */}
      <div className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 bg-amber-50 rounded-xl border border-amber-100"
          >
            <p className="text-sm text-slate-800">{tip.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsSection;
