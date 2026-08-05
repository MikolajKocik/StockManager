import React from 'react';

export interface FormBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormBody: React.FC<FormBodyProps> = ({ className = '', children, ...props }) => {
    return (
        <div className={`form-body ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface FormFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormFooter: React.FC<FormFooterProps> = ({ className = '', children, ...props }) => {
    return (
        <div className={`form-footer ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CheckboxCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: React.ReactNode;
    description?: React.ReactNode;
}

export const CheckboxCard: React.FC<CheckboxCardProps> = ({
    label,
    description,
    className = '',
    ...inputProps
}) => {
    return (
        <label className={`checkbox-card ${className}`}>
            <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 cursor-pointer accent-slate-800"
                {...inputProps}
            />
            <div>
                <span className="font-semibold text-slate-800 block text-xs">
                    {label}
                </span>
                {description && (
                    <span className="text-[0.6875rem] text-slate-500 block">
                        {description}
                    </span>
                )}
            </div>
        </label>
    );
};
