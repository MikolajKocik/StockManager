import React from 'react';
import './Select.css';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[] | string[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options,
    error, className = '', ...props }) => {
    return (
        <div className={`select-wrapper ${className}`}>
            {label && <label className="select-label">
                {label}
            </label>}
            <select className={`select-input ${error ? 'select-error' : ''}`} {...props}>
                {options.map((opt) => {
                    const value = typeof opt === 'string' ? opt :
                        opt.value;
                    const text = typeof opt === 'string' ? opt :
                        opt.label

                    return (
                        <option key={value} value={value}>
                            {text}
                        </option>
                    );
                })}
            </select>
            {error && <span className="error-text">{error}</span>}
        </div>
    )
}
