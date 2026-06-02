import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Chọn...',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full rounded-xl border bg-white
              text-slate-800 text-sm
              placeholder:text-slate-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              disabled:bg-slate-50 disabled:cursor-not-allowed
              pl-4 pr-11 py-3
              appearance-none cursor-pointer
              ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
              ${className}
            `}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
