import React from 'react';

const FormSelect = React.forwardRef(({ label, error, options = [], icon, ...props }, ref) => {
  return (
    <div className="space-y-xs w-full">
      {label && <label className="font-label-md text-label-md text-on-surface-variant block">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </span>
        )}
        <select
          ref={ref}
          className={`w-full bg-surface border rounded-lg font-body-md transition-all duration-200 ${
            icon ? 'pl-11 pr-md' : 'px-md'
          } py-md ${
            error ? 'border-error ring-1 ring-error/20' : 'border-outline'
          } focus:border-[#744700] focus:ring-4 focus:ring-[#f3ca4a]/20 outline-none`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-error font-body-sm text-xs mt-1">{error.message || error}</p>}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';
export default FormSelect;
