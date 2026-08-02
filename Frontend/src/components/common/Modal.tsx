import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    className = ''
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className={`bg-white border border-slate-300 rounded-lg shadow-2xl w-full ${sizeClasses[size] || sizeClasses.md} overflow-hidden text-slate-800 animate-scale-in ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title ? (
                    <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                        <h3 className="font-bold text-sm text-white">
                            {title}
                        </h3>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                        >
                            &#10005;
                        </button>
                    </div>
                ) : (
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-700 text-lg leading-none p-1 cursor-pointer z-10"
                    >
                        &#10005;
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
