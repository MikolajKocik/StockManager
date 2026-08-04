import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'outline' | 'ghost' | 'lavender' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'secondary',
    size = 'md',
    loading = false,
    isLoading = false,
    className = '',
    disabled,
    children,
    ...props
}) => {
    const isSpinnerActive = loading || isLoading;

    return (
        <button
            className={`btn btn-${variant} btn-${size} ${isSpinnerActive ? 'btn-loading' : ''} ${className}`}
            disabled={disabled || isSpinnerActive}
            {...props}
        >
            {isSpinnerActive ? (
                <span className="btn-spinner" aria-hidden="true" />
            ) : null}
            {children}
        </button>
    );
};
