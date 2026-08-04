import React, { forwardRef } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: readonly (SelectOption | string)[];
    error?: string;
    helperText?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    options,
    error,
    helperText,
    className = '',
    wrapperClassName = '',
    required,
    id,
    children,
    ...props
}, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`select-wrapper ${wrapperClassName}`}>
            {label && (
                <label htmlFor={selectId} className="select-label">
                    {label}
                    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <select
                ref={ref}
                id={selectId}
                required={required}
                className={`select-input ${error ? 'select-error' : ''} ${className}`}
                {...props}
            >
                {options && options.map((opt) => {
                    const value = typeof opt === 'string' ? opt : opt.value;
                    const text = typeof opt === 'string' ? opt : opt.label;
                    const disabled = typeof opt === 'object' ? opt.disabled : false;

                    return (
                        <option key={value} value={value} disabled={disabled}>
                            {text}
                        </option>
                    );
                })}
                {children}
            </select>
            {error && <span className="error-text">{error}</span>}
            {!error && helperText && <span className="helper-text">{helperText}</span>}
        </div>
    );
});

Select.displayName = 'Select';
