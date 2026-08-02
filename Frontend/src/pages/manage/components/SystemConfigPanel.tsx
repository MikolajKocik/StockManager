import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const SystemConfigPanel: React.FC = () => {
    const [config, setConfig] = useState({
        autoLockMinutes: 15,
        enforceGs1Barcodes: true,
        enableTwoManRuleForPz: true,
        autoAssignAlgorithm: 'SHORTEST_TRAVEL_DISTANCE',
        shiftRotationHours: 8,
        logRetentionDays: 90
    });

    const handleSave = () => {
        toast.success('System policies and security parameters updated successfully');
    };

    return (
        <div className="w-full bg-white border border-slate-300 rounded-lg p-5 shadow-xs space-y-6 text-xs text-slate-800">
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
                        <input
                            type="number"
                            value={config.autoLockMinutes}
                            onChange={(e) => setConfig({ ...config, autoLockMinutes: parseInt(e.target.value) || 5 })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-semibold block text-slate-800">Enforce GS1 Standard Barcodes</span>
                            <span className="text-[10px] text-slate-500">Block arbitrary free-text scans on inbound reception</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.enforceGs1Barcodes}
                            onChange={(e) => setConfig({ ...config, enforceGs1Barcodes: e.target.checked })}
                            className="w-4 h-4 accent-slate-800"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="font-semibold block text-slate-800">Two-Person Verification for High-Value Goods</span>
                            <span className="text-[10px] text-slate-500">Requires shift foreman confirmation on receipt</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.enableTwoManRuleForPz}
                            onChange={(e) => setConfig({ ...config, enableTwoManRuleForPz: e.target.checked })}
                            className="w-4 h-4 accent-slate-800"
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
                        <select
                            value={config.autoAssignAlgorithm}
                            onChange={(e) => setConfig({ ...config, autoAssignAlgorithm: e.target.value })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-semibold"
                        >
                            <option value="SHORTEST_TRAVEL_DISTANCE">Shortest Travel Distance (Aisle Optimized)</option>
                            <option value="ROUND_ROBIN">Balanced Brigade Workload (Round Robin)</option>
                            <option value="FIFO_EXPEDITE">Strict FIFO Due-Time Expedite</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Shift Duration & Handover Window (Hours)
                        </label>
                        <input
                            type="number"
                            value={config.shiftRotationHours}
                            onChange={(e) => setConfig({ ...config, shiftRotationHours: parseInt(e.target.value) || 8 })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block text-slate-700">
                            Audit Trail Log Retention (Days)
                        </label>
                        <input
                            type="number"
                            value={config.logRetentionDays}
                            onChange={(e) => setConfig({ ...config, logRetentionDays: parseInt(e.target.value) || 90 })}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-mono"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                    type="button"
                    onClick={handleSave}
                    className="bg-[#384155] hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-all shadow-xs"
                >
                    Save Operational Policies
                </button>
            </div>
        </div>
    );
};
