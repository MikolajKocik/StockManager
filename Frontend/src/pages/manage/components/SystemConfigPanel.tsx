import React from 'react';
import toast from 'react-hot-toast';
import { Button, Input, Select } from '@/components/common/core';

const TASK_ALLOCATION_OPTIONS = [
    { label: 'Shortest Travel Distance (Aisle Optimized)', value: 'SHORTEST_TRAVEL_DISTANCE' },
    { label: 'Balanced Brigade Workload (Round Robin)', value: 'ROUND_ROBIN' },
    { label: 'Strict FIFO Due-Time Expedite', value: 'FIFO_EXPEDITE' }
] as const;

export const SystemConfigPanel: React.FC = () => {
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log('Saved system policies:', data);
        toast.success('System policies and security parameters updated successfully');
    };

    return (
        <form onSubmit={handleSave} className="w-full bg-white border border-slate-300 rounded-lg p-5 shadow-xs space-y-6 text-xs text-slate-800">
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide">
                    Warehouse Security & Operational Parameters
                </h3>
                <p className="text-slate-500 mt-0.5">
                    Global parameters applied to mobile handhelds (Zebra/Honeywell) and automated dispatcher queues.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Handheld Terminal Policies */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] font-mono border-b border-slate-200 pb-2">
                        Mobile Terminal & Session Security
                    </h4>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Terminal Auto-Lock Timeout (Inactive Minutes)
                        </label>
                        <Input
                            name="autoLockMinutes"
                            type="number"
                            defaultValue={15}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-semibold block text-slate-800">Enforce GS1 Standard Barcodes</span>
                            <span className="text-[10px] text-slate-500">Block arbitrary free-text scans on inbound reception</span>
                        </div>
                        <input
                            name="enforceGs1Barcodes"
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 h-4 accent-[#2b6675]"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-semibold block text-slate-800">Two-Person Verification for High-Value Goods</span>
                            <span className="text-[10px] text-slate-500">Requires shift foreman confirmation on receipt</span>
                        </div>
                        <input
                            name="enableTwoManRuleForPz"
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 h-4 accent-[#2b6675]"
                        />
                    </div>
                </div>

                {/* Dispatch & Operations Policies */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] font-mono border-b border-slate-200 pb-2">
                        Task Dispatching & Shifts
                    </h4>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Automatic Task Allocation Strategy
                        </label>
                        <Select
                            name="autoAssignAlgorithm"
                            defaultValue="SHORTEST_TRAVEL_DISTANCE"
                            options={TASK_ALLOCATION_OPTIONS}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Shift Duration & Handover Window (Hours)
                        </label>
                        <Input
                            name="shiftRotationHours"
                            type="number"
                            defaultValue={8}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Audit Trail Log Retention (Days)
                        </label>
                        <Input
                            name="logRetentionDays"
                            type="number"
                            defaultValue={90}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
                <Button
                    variant="primary"
                    size="md"
                    type="submit"
                >
                    Save Operational Policies
                </Button>
            </div>
        </form>
    );
};
