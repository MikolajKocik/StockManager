import Modal from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 mb-8">{message}</p>

            <div className="flex justify-end gap-3">
                <Button className="p-1" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button className="p-1" variant="danger" onClick={() => {
                    onConfirm();
                    onClose();
                }}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
}
