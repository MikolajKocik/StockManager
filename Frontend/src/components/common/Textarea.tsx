import type React from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    className = '',
    required,
    ...props
}) => {
    return (
        <div className={`textarea-wrapper ${className}`}>
            {label && (
                <label className="textarea-label">
                    {label}
                    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <textarea
                required={required}
                className={`textarea-field ${error ? 'textarea-error' : ''}`}
                {...props}
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};
