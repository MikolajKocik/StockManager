import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'lavender' | 'danger' | 'accent' | 'ghost' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant,
    size,
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    const classes = ['btn', variant && `btn-${variant}`, size && `btn-${size}`, className, isLoading && 'btn-loading']
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="loader"></span> : children}
        </button>
    );
};
