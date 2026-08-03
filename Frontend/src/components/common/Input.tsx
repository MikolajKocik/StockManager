import type React from "react";
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', required, ...props }) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                </label>
            )}
            <input
                required={required}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

