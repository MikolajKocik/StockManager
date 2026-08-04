import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Button, Modal, FormBody, FormFooter } from '../core';

export interface ConfirmModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
}

export const ConfirmModal = forwardRef<HTMLDialogElement, ConfirmModalProps>(({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

    useEffect(() => {
        if (isOpen === undefined) return;
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [isOpen]);

    const handleDismiss = () => {
        if (dialogRef.current?.open) {
            dialogRef.current.close();
        }
        if (onClose) onClose();
        else if (onCancel) onCancel();
    };

    const handleConfirm = () => {
        onConfirm();
        handleDismiss();
    };

    return (
        <Modal
            ref={dialogRef}
            title={title}
            size="sm"
            onClose={handleDismiss}
        >
            <FormBody className="p-4 text-xs text-slate-700 leading-relaxed font-medium">
                {typeof message === 'string' ? <p>{message}</p> : message}
            </FormBody>

            <FormFooter>
                <Button
                    variant="secondary"
                    size="md"
                    type="button"
                    onClick={handleDismiss}
                >
                    {cancelText}
                </Button>
                <Button
                    variant={variant}
                    size="md"
                    type="button"
                    onClick={handleConfirm}
                >
                    {confirmText}
                </Button>
            </FormFooter>
        </Modal>
    );
});

ConfirmModal.displayName = 'ConfirmModal';
export default ConfirmModal;
