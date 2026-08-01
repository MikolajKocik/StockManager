import React, { useState } from 'react';
import type { MaintenanceMachine } from '@/models/maintenance';
import { Button } from '@/components/common';

interface ReportIncidentModalProps {
    isOpen: boolean;
    machines: MaintenanceMachine[];
    defaultAssetId?: string;
    onClose: () => void;
    onSubmit: (
        title: string,
        description: string,
        priority: 'Low' | 'Medium' | 'High' | 'Critical',
        assetId: string
    ) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
    isOpen,
    machines,
    defaultAssetId,
    onClose,
    onSubmit
}) => {
    const [assetId, setAssetId] = useState<string>(() => defaultAssetId || machines[0]?.id || '');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit(title.trim(), description.trim(), priority, assetId);
        setTitle('');
        setDescription('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 animate-scale-in">
                {/* Modal Header */}
                <div className="bg-[#384155] text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                        Report Machine Fault / Service Ticket
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white text-lg leading-none p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
                    {/* Machine Select */}
                    <div>
                        <label className="font-bold text-slate-700 block mb-1">
                            Select machinery asset:
                        </label>
                        <select
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-slate-800"
                        >
                            {machines.map((m) => (
                                <option key={m.id} value={m.id}>
                                    [{m.code}] {m.name} – (SN: {m.serialNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority & Quick Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Priority Level:
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-semibold outline-none focus:border-slate-800"
                            >
                                <option value="Low">Low (Scheduled Inspection)</option>
                                <option value="Medium">Medium (Minor Issue)</option>
                                <option value="High">High (Needs Intervention)</option>
                                <option value="Critical">Critical (Immediate Outage)</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-slate-700 block mb-1">
                                Issue Template:
                            </label>
                            <select
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium outline-none focus:border-slate-800"
                            >
                                <option value="">-- Select Template or Type Below --</option>
                                <option value="Hydraulic mast oil pressure loss">Hydraulic Leakage</option>
                                <option value="CAN-bus Controller / Motor Error">CAN Controller Error</option>
                                <option value="Battery Charging & Connection Error">Battery Fault</option>
                                <option value="Forks / Mast Mechanical Wear">Forks/Mast Wear</option>
                                <option value="Periodic Safety Inspection">Safety Inspection</option>
                            </select>
                        </div>
                    </div>

                    {/* Title input */}
                    <div>
                        <label className="font-bold text-slate-700 block mb-1">
                            Incident Title / Fault Code:
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Hydraulic pump pressure loss, code ERR-401..."
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 outline-none focus:border-slate-800 focus:bg-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="font-bold text-slate-700 block mb-1">
                            Detailed Description & Symptoms:
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe symptoms, whether machine is immobilised, towing requirements..."
                            className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 outline-none focus:border-slate-800 focus:bg-white resize-none"
                        />
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                        <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" size="sm" type="submit">
                            Submit Service Ticket
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
