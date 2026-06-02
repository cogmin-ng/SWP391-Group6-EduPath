import { Play, FileText, Code, BookOpen } from 'lucide-react';

/**
 * Returns the appropriate icon and accent color for a material type.
 */
function getMaterialMeta(type) {
  switch (type) {
    case 'VIDEO':
      return {
        Icon: Play,
        bgColor: 'bg-red-50',
        iconColor: 'text-red-500',
        label: 'VIDEO',
      };
    case 'ARTICLE':
      return {
        Icon: FileText,
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        label: 'ARTICLE',
      };
    case 'DOCUMENTATION':
      return {
        Icon: Code,
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        label: 'DOCUMENTATION',
      };
    default:
      return {
        Icon: BookOpen,
        bgColor: 'bg-slate-50',
        iconColor: 'text-slate-500',
        label: type,
      };
  }
}

/**
 * Individual material card.
 */
function MaterialCard({ material }) {
  const { Icon, bgColor, iconColor, label } = getMaterialMeta(material.type);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md hover:border-indigo-100 transition-all duration-200 group">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>

      {/* Type label */}
      <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
        {label}
      </p>

      {/* Title */}
      <h4 className="text-sm font-bold text-slate-800 mb-3 leading-snug">
        {material.title}
      </h4>

      {/* Action button */}
      <button className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 cursor-pointer">
        {material.buttonLabel}
      </button>
    </div>
  );
}

/**
 * Materials section — displays a grid of learning material cards.
 *
 * Props:
 * - materials: [{ id, title, type, buttonLabel, url }]
 */
export default function MaterialsSection({ materials }) {
  if (!materials || materials.length === 0) return null;

  return (
    <section className="animate-fadeIn">
      {/* Section title */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Tài liệu học tập
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {materials.map((mat) => (
          <MaterialCard key={mat.id} material={mat} />
        ))}
      </div>
    </section>
  );
}
