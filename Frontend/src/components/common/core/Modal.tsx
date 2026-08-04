import React, { forwardRef, useEffect, useRef } from 'react';

export interface ModalProps {
    children: React.ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(({
    children,
    title,
    size = 'md',
    className = '',
    isOpen,
    onClose
}, forwardedRef) => {
    const internalRef = useRef<HTMLDialogElement | null>(null);

    const setRef = (node: HTMLDialogElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
            forwardedRef(node);
        } else if (forwardedRef) {
            forwardedRef.current = node;
        }
    };

    useEffect(() => {
        const dialog = internalRef.current;
        if (!dialog) return;

        if (isOpen === true && !dialog.open) {
            dialog.showModal();
        } else if (isOpen === false && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    const closeDialog = () => {
        if (internalRef.current?.open) {
            internalRef.current.close();
        }
        onClose?.();
    };

    const closeOnBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            closeDialog();
        }
    };

    return (
        <dialog
            ref={setRef}
            className={`m-auto p-0 bg-white rounded-lg shadow-2xl w-full ${sizeClasses[size]} border-0 outline-none overflow-hidden text-slate-800 backdrop:bg-slate-900/60 backdrop:backdrop-blur-xs open:animate-scale-in ${className}`}
            onClick={closeOnBackdrop}
            onClose={onClose}
        >
            <div className="w-full flex flex-col overflow-hidden">
                {title ? (
                    <div className="bg-[#2b6675] text-white px-4 py-3 flex items-center justify-between border-b border-[#204e5a] select-none">
                        <h3 className="font-bold text-sm text-white tracking-wide">
                            {title}
                        </h3>
                        <button
                            type="button"
                            onClick={closeDialog}
                            className="text-slate-200 hover:text-white text-lg leading-none p-1 cursor-pointer transition-colors"
                        >
                            &#10005;
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={closeDialog}
                        className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-700 text-lg leading-none p-1 cursor-pointer z-10 transition-colors"
                    >
                        &#10005;
                    </button>
                )}
                {children}
            </div>
        </dialog>
    );
});

Modal.displayName = 'Modal';
export default Modal;
