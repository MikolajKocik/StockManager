import React, { useState, useMemo } from 'react';
import type { WmsModuleDefinition, RolePermissionMatrix, WmsModuleKey, AccessLevel } from '../models/rbac';
import { Input } from '@/components/common/core';

interface RbacMatrixGridProps {
    modules: WmsModuleDefinition[];
    roles: RolePermissionMatrix[];
    onTogglePermission: (roleId: string, moduleKey: WmsModuleKey, newLevel: AccessLevel) => void;
    onBulkUpdateRole: (roleId: string, level: AccessLevel) => void;
    onBulkUpdateModule: (moduleKey: WmsModuleKey, level: AccessLevel) => void;
}

const DOMAIN_CATEGORIES = ['ALL', 'LOGISTICS', 'MASTER_DATA', 'EQUIPMENT', 'ADMINISTRATION'] as const;

const NEXT_ACCESS_LEVEL: Record<AccessLevel, AccessLevel> = {
    'NONE': 'READ',
    'READ': 'WRITE',
    'WRITE': 'ADMIN',
    'ADMIN': 'NONE'
};

interface LevelBadgeInfo {
    label: string;
    bgColor: string;
    dotColor: string;
    description: string;
}

const LEVEL_BADGE_MAP: Record<AccessLevel, LevelBadgeInfo> = {
    'ADMIN': {
        label: 'ADMIN',
        bgColor: 'bg-red-50 text-red-900 border-red-300 hover:bg-red-100',
        dotColor: 'bg-red-600',
        description: 'Full management & deletion rights'
    },
    'WRITE': {
        label: 'READ / WRITE',
        bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
        dotColor: 'bg-emerald-600',
        description: 'Execute tasks, create & edit records'
    },
    'READ': {
        label: 'VIEW ONLY',
        bgColor: 'bg-[#f0f7f8] text-[#2b6675] border-[#2b6675]/30 hover:bg-[#e6f0f2]',
        dotColor: 'bg-[#2b6675]',
        description: 'Read-only inspection'
    },
    'NONE': {
        label: 'NO ACCESS',
        bgColor: 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100',
        dotColor: 'bg-slate-300',
        description: 'Module locked on terminal and web'
    }
};

export const RbacMatrixGrid: React.FC<RbacMatrixGridProps> = ({
    modules,
    roles,
    onTogglePermission,
    onBulkUpdateRole,
    onBulkUpdateModule
}) => {
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const filteredRoles = useMemo(() => {
        return roles.filter(r =>
            r.roleName.toLowerCase().includes(searchFilter.toLowerCase()) ||
            r.roleDescription.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [roles, searchFilter]);

    const filteredModules = useMemo(() => {
        return selectedCategory === 'ALL'
            ? modules
            : modules.filter(m => m.category === selectedCategory);
    }, [modules, selectedCategory]);

    return (
        <div className="w-full space-y-3 text-xs">
            {/* Top Matrix Controls & Filter Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-64">
                        <Input
                            type="text"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            placeholder="Filter role or brigade profile..."
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-1">
                        <span className="text-[0.625rem] font-bold text-slate-500 uppercase font-mono mr-1">
                            Domain:
                        </span>
                        {DOMAIN_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-2.5 py-1 rounded text-[0.6875rem] font-semibold cursor-pointer transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-[#2b6675] text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-[0.6875rem] font-mono">
                    <span className="text-slate-500 font-sans">Cycle:</span>
                    <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 border border-slate-300">None</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="px-1.5 py-0.2 rounded-xs bg-[#f0f7f8] text-[#2b6675] border border-[#2b6675]/30 font-bold">View</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="px-1.5 py-0.2 rounded-xs bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold">R/W</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="px-1.5 py-0.2 rounded-xs bg-red-50 text-red-900 border border-red-300 font-bold">Admin</span>
                </div>
            </div>

            {/* Interactive Grid Table */}
            <div className="w-full bg-white border border-slate-300 rounded-lg shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[59.375rem]">
                        <thead>
                            <tr className="bg-[#2b6675] text-white border-b border-[#204e5a]">
                                {/* Roles Sticky Column */}
                                <th className="py-2.5 px-3 text-xs font-bold w-72 shrink-0 border-r border-[#204e5a]">
                                    <div className="flex items-center justify-between">
                                        <span className="uppercase tracking-wider font-mono text-[0.625rem]">
                                            WMS Role / Brigade Profile
                                        </span>
                                        <span className="text-[0.625rem] text-slate-200 font-normal">
                                            {filteredRoles.length} Roles
                                        </span>
                                    </div>
                                </th>

                                {/* Functional Modules Headers */}
                                {filteredModules.map((mod) => (
                                    <th
                                        key={mod.key}
                                        className="py-2 px-2 text-center text-xs font-semibold border-r border-[#204e5a]/80 min-w-[6.875rem]"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-bold text-[0.6875rem] text-white leading-tight">
                                                {mod.title}
                                            </span>
                                            <span className="text-[0.5625rem] text-slate-200 font-mono uppercase bg-black/20 px-1 py-0.2 rounded-xs">
                                                {mod.category.replace('_', ' ')}
                                            </span>

                                            {/* Quick Column Bulk Toggles */}
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <button
                                                    type="button"
                                                    title={`Grant WRITE to all for ${mod.title}`}
                                                    onClick={() => onBulkUpdateModule(mod.key, 'WRITE')}
                                                    className="px-1 py-0.2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xs text-[0.5rem] font-mono font-bold cursor-pointer"
                                                >
                                                    All R/W
                                                </button>
                                                <button
                                                    type="button"
                                                    title={`Revoke all access for ${mod.title}`}
                                                    onClick={() => onBulkUpdateModule(mod.key, 'NONE')}
                                                    className="px-1 py-0.2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xs text-[0.5rem] font-mono cursor-pointer"
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
                                    <td className="py-2.5 px-3 border-r border-slate-200 bg-slate-50/50">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900 text-xs">
                                                    {role.roleName}
                                                </span>
                                                <span className="text-[0.625rem] font-mono bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold">
                                                    {role.userCount} staff
                                                </span>
                                            </div>
                                            <p className="text-[0.625rem] text-slate-600 leading-tight">
                                                {role.roleDescription}
                                            </p>

                                            {/* Row Fast-Action Presets */}
                                            <div className="flex items-center gap-1 pt-0.5">
                                                <span className="text-[0.5625rem] text-slate-400 font-mono">Row:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'WRITE')}
                                                    className="text-[0.5625rem] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-1 py-0.2 rounded-xs cursor-pointer transition-colors"
                                                >
                                                    All R/W
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'READ')}
                                                    className="text-[0.5625rem] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-1 py-0.2 rounded-xs cursor-pointer transition-colors"
                                                >
                                                    All View
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onBulkUpdateRole(role.roleId, 'NONE')}
                                                    className="text-[0.5625rem] bg-slate-200 hover:bg-red-100 hover:text-red-800 text-slate-700 font-medium px-1 py-0.2 rounded-xs cursor-pointer transition-colors"
                                                >
                                                    Lock All
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Permission Matrix Cells */}
                                    {filteredModules.map((mod) => {
                                        const currentLevel = role.permissions[mod.key] || 'NONE';
                                        const badge = LEVEL_BADGE_MAP[currentLevel];

                                        return (
                                            <td
                                                key={mod.key}
                                                className="py-2 px-1.5 text-center border-r border-slate-200 select-none align-middle"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => onTogglePermission(role.roleId, mod.key, NEXT_ACCESS_LEVEL[currentLevel])}
                                                    title={`${role.roleName} - ${mod.title}\nStatus: ${badge.label} (${badge.description})`}
                                                    className={`w-full py-1.5 px-1 rounded-xs border transition-all cursor-pointer shadow-2xs font-mono text-[0.5625rem] font-bold flex flex-col items-center justify-center gap-0.5 ${badge.bgColor}`}
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
