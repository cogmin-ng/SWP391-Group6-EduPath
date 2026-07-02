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
        label: 'Video',
      };
    case 'ARTICLE':
      return {
        Icon: FileText,
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        label: 'Bài viết',
      };
    case 'DOCUMENTATION':
      return {
        Icon: Code,
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        label: 'Tài liệu',
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
  const hasUrl = Boolean(material.url);

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
      {hasUrl ? (
        <a
          href={material.url}
          target="_blank"
          rel="noreferrer"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 cursor-pointer inline-flex items-center justify-center"
        >
          {material.buttonLabel}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
        >
          {material.buttonLabel}
        </button>
      )}
    </div>
  );
}

function CompactMaterialCard({ material }) {
  const { Icon, bgColor, iconColor, label } = getMaterialMeta(material.type);
  const hasUrl = Boolean(material.url);

  const content = (
    <>
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${bgColor}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="line-clamp-2 text-sm font-semibold text-slate-900">{material.title}</p>
      </div>
      <div className="text-xs font-semibold text-indigo-600">{material.buttonLabel}</div>
    </>
  );

  if (hasUrl) {
    return (
      <a
        href={material.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-indigo-100 hover:bg-slate-50"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 opacity-70">
      {content}
    </div>
  );
}

/**
 * Materials section — displays a grid of learning material cards.
 *
 * Props:
 * - materials: [{ id, title, type, buttonLabel, url }]
 */
export default function MaterialsSection({ materials, variant = 'grid' }) {
  if (!materials || materials.length === 0) return null;

  if (variant === 'compact') {
    return (
      <section className="animate-fadeIn rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tài liệu học tập</h3>
            <p className="text-xs text-slate-400">Mở nhanh các tài nguyên đi kèm của node hiện tại.</p>
          </div>
        </div>

        <div className="space-y-3">
          {materials.map((material) => (
            <CompactMaterialCard key={material.id} material={material} />
          ))}
        </div>
      </section>
    );
  }

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
