import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    helperText,
    className = '',
    wrapperClassName = '',
    required,
    id,
    ...props
}, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={`textarea-wrapper ${wrapperClassName}`}>
            {label && (
                <label htmlFor={textareaId} className="textarea-label">
                    {label}
                    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                required={required}
                className={`textarea-field ${error ? 'textarea-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="error-text">{error}</span>}
            {!error && helperText && <span className="helper-text">{helperText}</span>}
        </div>
    );
});

Textarea.displayName = 'Textarea';
