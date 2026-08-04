import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    className = '',
    wrapperClassName = '',
    required,
    id,
    ...props
}, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`input-wrapper ${wrapperClassName}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                required={required}
                className={`input-field ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="error-text">{error}</span>}
            {!error && helperText && <span className="helper-text">{helperText}</span>}
        </div>
    );
});

Input.displayName = 'Input';
