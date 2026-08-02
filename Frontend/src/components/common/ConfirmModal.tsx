import { Button } from './Button';

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title,
    message
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const handleDismiss = () => {
        if (onClose) onClose();
        else if (onCancel) onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">
                        {title}
                    </h3>
                    <button
                        onClick={handleDismiss}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1 cursor-pointer"
                    >
                        &#10005;
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 text-xs text-slate-700 leading-relaxed">
                    <p>{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDismiss}
                        className="text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                            onConfirm();
                            handleDismiss();
                        }}
                        className="text-xs font-semibold"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
}
