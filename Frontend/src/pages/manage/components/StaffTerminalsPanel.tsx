import React, { useState } from 'react';
import type { StaffOperator, RolePermissionMatrix } from '../models/rbac';

interface StaffTerminalsPanelProps {
    staff: StaffOperator[];
    roles: RolePermissionMatrix[];
    onUpdateUserRole: (userId: string, newRoleId: string) => void;
    onToggleUserActive: (userId: string) => void;
}

export const StaffTerminalsPanel: React.FC<StaffTerminalsPanelProps> = ({
    staff,
    roles,
    onUpdateUserRole,
    onToggleUserActive
}) => {
    const [search, setSearch] = useState('');
    const [filterBrigade, setFilterBrigade] = useState('ALL');

    const brigades = Array.from(new Set(staff.map(s => s.assignedBrigade)));

    const filtered = staff.filter(s => {
        const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
            s.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
            s.terminalId.toLowerCase().includes(search.toLowerCase());
        const matchesBrigade = filterBrigade === 'ALL' || s.assignedBrigade === filterBrigade;
        return matchesSearch && matchesBrigade;
    });

    return (
        <div className="w-full space-y-4 text-xs">
            {/* Filter Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search operator, badge code or terminal ID..."
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-xs w-72 focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium"
                    />

                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                            Brigade:
                        </span>
                        <select
                            value={filterBrigade}
                            onChange={(e) => setFilterBrigade(e.target.value)}
                            className="px-2.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white font-medium"
                        >
                            <option value="ALL">All Brigades & Sectors</option>
                            {brigades.map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-600">
                    Showing <span className="font-bold text-slate-900">{filtered.length}</span> active operators
                </div>
            </div>

            {/* Operators Table */}
            <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#384155] text-white border-b border-slate-700 font-mono text-[11px]">
                            <th className="py-2.5 px-3">Operator / Badge</th>
                            <th className="py-2.5 px-3">Assigned Role Profile</th>
                            <th className="py-2.5 px-3">Brigade / Team</th>
                            <th className="py-2.5 px-3">Handheld Terminal</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {filtered.map(op => {
                            const currentRole = roles.find(r => r.roleId === op.roleId);

                            return (
                                <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-3">
                                        <div className="font-bold text-slate-900 text-xs">{op.fullName}</div>
                                        <div className="text-[10px] font-mono text-slate-500">
                                            {op.employeeCode} &bull; {op.email}
                                        </div>
                                    </td>

                                    <td className="py-3 px-3">
                                        <select
                                            value={op.roleId}
                                            onChange={(e) => onUpdateUserRole(op.id, e.target.value)}
                                            className="px-2 py-1 border border-slate-300 rounded bg-white text-xs font-semibold text-slate-800"
                                        >
                                            {roles.map(r => (
                                                <option key={r.roleId} value={r.roleId}>
                                                    {r.roleName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-3 px-3 font-medium text-slate-700">
                                        {op.assignedBrigade}
                                    </td>

                                    <td className="py-3 px-3 font-mono text-xs">
                                        <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-800 font-semibold">
                                            {op.terminalId}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${op.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <span className="font-medium text-slate-800">
                                                {op.isActive ? 'Online' : 'Disabled'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                ({op.lastActive})
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3 px-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onToggleUserActive(op.id)}
                                            className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                                                op.isActive
                                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                            }`}
                                        >
                                            {op.isActive ? 'Lock Terminal' : 'Unlock'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
