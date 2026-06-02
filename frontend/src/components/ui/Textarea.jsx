import { forwardRef } from 'react';

const Textarea = forwardRef(
  (
    {
      label,
      error,
      className = '',
      rows = 4,
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
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full rounded-xl border bg-white
            text-slate-800 text-sm
            placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            disabled:bg-slate-50 disabled:cursor-not-allowed
            p-4
            resize-none
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 hover:border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
