import React, { useState } from 'react';
import type { WmsModuleDefinition, RolePermissionMatrix, WmsModuleKey, AccessLevel } from '../models/rbac';

interface RbacMatrixGridProps {
    modules: WmsModuleDefinition[];
    roles: RolePermissionMatrix[];
    onTogglePermission: (roleId: string, moduleKey: WmsModuleKey, newLevel: AccessLevel) => void;
    onBulkUpdateRole: (roleId: string, level: AccessLevel) => void;
    onBulkUpdateModule: (moduleKey: WmsModuleKey, level: AccessLevel) => void;
}

export const RbacMatrixGrid: React.FC<RbacMatrixGridProps> = ({
    modules,
    roles,
    onTogglePermission,
    onBulkUpdateRole,
    onBulkUpdateModule
}) => {
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    {/* Cycle to next permission level */}
    const getNextLevel = (current: AccessLevel): AccessLevel => {
        switch (current) {
            case 'NONE': return 'READ';
            case 'READ': return 'WRITE';
            case 'WRITE': return 'ADMIN';
            case 'ADMIN': return 'NONE';
            default: return 'NONE';
        }
    };

    const filteredRoles = roles.filter(r =>
        r.roleName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.roleDescription.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const filteredModules = selectedCategory === 'ALL'
        ? modules
        : modules.filter(m => m.category === selectedCategory);

    {/* Style mapping for permission levels */}
    const getLevelBadge = (level: AccessLevel) => {
        switch (level) {
            case 'ADMIN':
                return {
                    label: 'ADMIN',
                    bgColor: 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200',
                    dotColor: 'bg-rose-600',
                    description: 'Full management, delete & approvals'
                };
            case 'WRITE':
                return {
                    label: 'READ / WRITE',
                    bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
                    dotColor: 'bg-emerald-600',
                    description: 'Execute tasks, create & edit records'
                };
            case 'READ':
                return {
                    label: 'VIEW ONLY',
                    bgColor: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
                    dotColor: 'bg-blue-600',
                    description: 'Read-only access without edit rights'
                };
            case 'NONE':
            default:
                return {
                    label: 'NO ACCESS',
                    bgColor: 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/80',
                    dotColor: 'bg-slate-300',
                    description: 'Module locked on terminal and web'
                };
        }
    };

    return (
        <div className="w-full space-y-4 text-xs">
            {/* Top Matrix Controls & Filter Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Filter role or brigade..."
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-xs w-64 focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium"
                    />

                    {/* Category Filter */}
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-700 uppercase font-mono mr-1">
                            Domain:
                        </span>
                        {['ALL', 'LOGISTICS', 'MASTER_DATA', 'EQUIPMENT', 'ADMINISTRATION'].map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-[#384155] text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-700 font-sans font-semibold">Click cell to cycle:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300">None</span>
                    <span className="text-slate-700">&rarr;</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold">View</span>
                    <span className="text-slate-700">&rarr;</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">Read/Write</span>
                    <span className="text-slate-700">&rarr;</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 font-bold">Admin</span>
                </div>
            </div>

            {/* Interactive Grid Table */}
            <div className="w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[950px]">
                        <thead>
                            <tr className="bg-[#384155] text-white border-b border-slate-700">
                                {/* Roles Sticky Column */}
                                <th className="py-3 px-3.5 text-xs font-bold w-72 shrink-0 border-r border-slate-600">
                                    <div className="flex items-center justify-between">
                                        <span className="uppercase tracking-wider font-mono text-[11px]">
                                            WMS Role / Brigade Profile
                                        </span>
                                        <span className="text-[10px] text-slate-300 font-normal">
                                            {filteredRoles.length} Roles
                                        </span>
                                    </div>
                                </th>

                                {/* Functional Modules Headers */}
                                {filteredModules.map((mod) => (
                                    <th
                                        key={mod.key}
                                        className="py-2.5 px-2 text-center text-xs font-semibold border-r border-slate-600/70 min-w-[110px]"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-bold text-[11px] text-white leading-tight">
                                                {mod.title}
                                            </span>
                                            <span className="text-[9px] text-slate-300 font-mono uppercase bg-slate-700/80 px-1.5 py-0.2 rounded">
                                                {mod.category.replace('_', ' ')}
                                            </span>

                                            {/* Quick Column Bulk Toggles */}
                                            <div className="flex items-center gap-1 mt-1">
                                                <button
                                                    type="button"
                                                    title={`Grant WRITE to all for ${mod.title}`}
                                                    onClick={() => onBulkUpdateModule(mod.key, 'WRITE')}
                                                    className="px-1 py-0.2 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[8px] font-mono font-bold cursor-pointer"
                                                >
                                                    All R/W
                                                </button>
                                                <button
                                                    type="button"
                                                    title={`Revoke all access for ${mod.title}`}
                                                    onClick={() => onBulkUpdateModule(mod.key, 'NONE')}
                                                    className="px-1 py-0.2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-[8px] font-mono cursor-pointer"
                                                >
                                                    Revoke
                                                </button>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {filteredRoles.map((role) => (
                                <tr key={role.roleId} className="hover:bg-slate-50/70 transition-colors">
                                    {/* Role Row Header with Bulk Actions */}
                                    <td className="py-3 px-3.5 border-r border-slate-200 bg-slate-50/50">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 text-xs">
                                                    {role.roleName}
                                                </span>
                                                <span className="text-[10px] font-mono bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold">
                                                    {role.userCount} staff
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-700 leading-tight">
                                                {role.roleDescription}
                                            </p>

                                            {/* Row Fast-Action Presets */}
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="text-[9px] text-slate-700 font-mono">Row:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'WRITE')}
                                                    className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                                >
                                                    Grant All R/W
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'READ')}
                                                    className="text-[9px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                                >
                                                    All View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'NONE')}
                                                    className="text-[9px] bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                                >
                                                    Lock All
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Permission Matrix Cells */}
                                    {filteredModules.map((mod) => {
                                        const currentLevel = role.permissions[mod.key] || 'NONE';
                                        const badge = getLevelBadge(currentLevel);

                                        return (
                                            <td
                                                key={mod.key}
                                                className="py-2.5 px-2 text-center border-r border-slate-200 select-none align-middle"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => onTogglePermission(role.roleId, mod.key, getNextLevel(currentLevel))}
                                                    title={`${role.roleName} &bull; ${mod.title}\nStatus: ${badge.label} (${badge.description})\nClick to change access level`}
                                                    className={`w-full py-2 px-1 rounded border transition-all cursor-pointer shadow-2xs font-mono text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 ${badge.bgColor}`}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                                                        <span>{badge.label}</span>
                                                    </div>
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
