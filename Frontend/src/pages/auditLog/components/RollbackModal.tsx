import React, { useState } from 'react';
import { 
    Modal, 
    Button, 
    Badge 
} from '@/components/common';
import type { AuditLogEvent } from '@/models/auditLog';
import { auditLogApi } from '@/api/internal/auditLogApi';
import toast from 'react-hot-toast';

export interface RollbackModalProps {
    event: AuditLogEvent | null;
    isOpen: boolean;
    onClose: () => void;
    onRollbackComplete?: () => void;
}

export const RollbackModal: React.FC<RollbackModalProps> = ({
    event,
    isOpen,
    onClose,
    onRollbackComplete
}) => {
    const [isSimulating, setIsSimulating] = useState<boolean>(false);

    if (!event) return null;

    const handleConfirmRollback = async () => {
        setIsSimulating(true);
        try {
            const res = await auditLogApi.simulateRollback(event.id);
            toast.success(res.message);
            onRollbackComplete?.();
            onClose();
        } catch {
            toast.error('Failed to simulate rollback');
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Simulate State Rollback: ${event.entityName}`}
            size="lg"
        >
            <div className="p-4 space-y-4 font-mono text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-2">
                        <Badge variant="amber">Simulation Mode</Badge>
                        <span>Reverting mutation event #{event.commitHash}</span>
                    </div>
                    <p className="text-xs font-sans text-amber-900">
                        This operation simulates restoring <strong>{event.entityName}</strong> to the exact state prior to <strong>{event.actionLabel}</strong> applied by {event.user.name}.
                    </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase block">
                        State Restoration Preview
                    </span>
                    <div className="p-3 bg-white border border-slate-200 rounded overflow-x-auto">
                        <pre className="text-xs text-slate-800">
                            {JSON.stringify(event.previousStateSnapshot, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        isLoading={isSimulating}
                        onClick={handleConfirmRollback}
                    >
                        Execute Rollback Simulation
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
