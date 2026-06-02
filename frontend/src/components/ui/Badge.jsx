const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    draft: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-blue-50 text-blue-700 border border-blue-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
        transition-colors duration-200
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
