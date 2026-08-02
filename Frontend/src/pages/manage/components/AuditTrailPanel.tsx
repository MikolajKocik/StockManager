import React from 'react';
import type { SystemAuditLog } from '../models/rbac';

interface AuditTrailPanelProps {
    logs: SystemAuditLog[];
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ logs }) => {
    return (
        <div className="w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 uppercase font-mono text-[11px]">
                        Security & Access Mutation Audit Log
                    </h3>
                    <p className="text-slate-500 text-[10px]">
                        Immutable event record of permission delegations, emergency overrides, and terminal sync commands.
                    </p>
                </div>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-semibold">
                    {logs.length} Recorded Events
                </span>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#384155] text-white font-mono text-[10px] uppercase">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Actor / Authorizer</th>
                        <th className="py-2.5 px-3">Action Type</th>
                        <th className="py-2.5 px-3">Target Entity</th>
                        <th className="py-2.5 px-3">Details & Changes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-slate-500 font-sans">{log.timestamp}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">{log.actorName}</td>
                            <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    log.action.includes('DEPLOY') ? 'bg-blue-100 text-blue-800' :
                                    log.action.includes('EMERGENCY') ? 'bg-amber-100 text-amber-900' :
                                    'bg-slate-100 text-slate-800'
                                }`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{log.targetRoleOrUser}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-sans">{log.changeSummary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
