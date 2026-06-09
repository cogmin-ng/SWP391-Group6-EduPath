import { Plus, Play, BookOpen } from 'lucide-react';

const MaterialsSection = ({ materials }) => {
  const getIcon = (iconName) => {
    const icons = { Play, BookOpen };
    return icons[iconName] || BookOpen;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tài Liệu</h2>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {materials.map((material) => {
          const IconComponent = getIcon(material.icon);
          return (
            <div
              key={material.id}
              className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-all cursor-pointer bg-slate-50/50"
            >
              {/* Icon & Meta */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">
                    {material.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {material.type}
                    {material.duration && ` • ${material.duration}`}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 line-clamp-2">{material.description}</p>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm py-2 rounded-lg hover:bg-indigo-50 transition-colors">
        <Plus className="w-4 h-4" />
        Thêm Tài Liệu
      </button>
    </div>
  );
};

export default MaterialsSection;
