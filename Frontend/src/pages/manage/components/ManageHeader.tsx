import React from 'react';

export type ManageModuleTab = 'RBAC_ROLES_MATRIX' | 'STAFF_OPERATORS' | 'SYSTEM_POLICIES' | 'AUDIT_TRAIL';

interface ManageHeaderProps {
    activeTab: ManageModuleTab;
    onTabChange: (tab: ManageModuleTab) => void;
    onDeployChanges: () => void;
    onResetChanges: () => void;
    hasUnsavedChanges: boolean;
    unsavedChangesCount: number;
}

export const ManageHeader: React.FC<ManageHeaderProps> = ({
    activeTab,
    onTabChange,
    onDeployChanges,
    onResetChanges,
    hasUnsavedChanges,
    unsavedChangesCount
}) => {
    return (
        <div className="w-full space-y-3">
            {/* Top Dark Header Card */}
            <div className="bg-[#384155] rounded-xl p-4 md:p-5 text-white shadow-lg border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#fbbf24] text-slate-950 font-black text-xs px-2.5 py-1 rounded font-mono tracking-wider uppercase shadow-xs">
                            SYSTEM RBAC & SECURITY
                        </span>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Warehouse Access & Administration Matrix
                        </h1>
                    </div>
                    <p className="text-xs text-slate-300">
                        Interactive role-based access control grid, brigade permission toggles, and mobile terminal policies.
                    </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    {hasUnsavedChanges && (
                        <button
                            type="button"
                            onClick={onResetChanges}
                            className="bg-slate-700/80 hover:bg-slate-600 border border-slate-500/60 text-slate-200 text-xs px-3.5 py-2 rounded-lg font-medium cursor-pointer shadow-xs transition-all"
                        >
                            Discard Changes ({unsavedChangesCount})
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onDeployChanges}
                        className={`text-xs px-4 py-2 rounded-lg font-bold cursor-pointer shadow-md transition-all flex items-center gap-2 ${
                            hasUnsavedChanges
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                    >
                        <span>Deploy Permissions to Terminals</span>
                        {hasUnsavedChanges && (
                            <span className="bg-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                                {unsavedChangesCount} Pending
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Active Operators
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-800 font-mono">54</span>
                        <span className="text-xs text-emerald-800 font-medium">38 Online</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Configured Roles
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-slate-800 font-mono">7</span>
                        <span className="text-xs text-blue-800 font-medium">10 Modules</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Security Enforcement
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-emerald-800 font-mono">100%</span>
                        <span className="text-xs text-slate-700 font-medium">RBAC Active</span>
                    </div>
                </div>

                <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block font-mono">
                        Matrix Status
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-sm font-bold font-mono ${hasUnsavedChanges ? 'text-amber-800' : 'text-slate-800'}`}>
                            {hasUnsavedChanges ? 'Unsaved Edits' : 'Synchronized'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border border-slate-300 rounded-lg p-1.5 flex flex-wrap gap-1 shadow-xs">
                <button
                    type="button"
                    onClick={() => onTabChange('RBAC_ROLES_MATRIX')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'RBAC_ROLES_MATRIX'
                            ? 'bg-[#384155] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Role Permissions Grid (RBAC Matrix)
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('STAFF_OPERATORS')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'STAFF_OPERATORS'
                            ? 'bg-[#384155] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Staff & Handheld Terminals
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('SYSTEM_POLICIES')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'SYSTEM_POLICIES'
                            ? 'bg-[#384155] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    System Security & Shift Policies
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('AUDIT_TRAIL')}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'AUDIT_TRAIL'
                            ? 'bg-[#384155] text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Access Change Audit Trail
                </button>
            </div>
        </div>
    );
};
