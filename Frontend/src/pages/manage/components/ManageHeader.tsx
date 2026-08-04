import React from 'react';
import { Header, Button } from '@/components/common/core';
import { KpiCard } from '@/components/common/custom';

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
    const actions = (
        <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
                <Button
                    variant="outline"
                    size="md"
                    onClick={onResetChanges}
                >
                    Discard Changes ({unsavedChangesCount})
                </Button>
            )}

            <Button
                variant={hasUnsavedChanges ? 'primary' : 'outline'}
                size="md"
                onClick={onDeployChanges}
            >
                Deploy Permissions ({hasUnsavedChanges ? `${unsavedChangesCount} Pending` : 'Synchronized'})
            </Button>
        </div>
    );

    return (
        <div className="w-full space-y-3">
            <Header
                title="Warehouse Access & Administration Matrix"
                subtitle="Role-based access control grid, brigade permission toggles, and mobile terminal policies"
                actions={actions}
            />

            {/* Quick KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                    title="Active Operators"
                    value="54"
                    subtitle="38 Online"
                    variant="success"
                />
                <KpiCard
                    title="Configured Roles"
                    value="7"
                    subtitle="10 Modules"
                    variant="primary"
                />
                <KpiCard
                    title="Security Enforcement"
                    value="100%"
                    subtitle="RBAC Active"
                    variant="success"
                />
                <KpiCard
                    title="Matrix Status"
                    value={hasUnsavedChanges ? 'Pending' : 'In Sync'}
                    subtitle={hasUnsavedChanges ? `${unsavedChangesCount} unsaved` : 'Up to date'}
                    variant={hasUnsavedChanges ? 'warning' : 'success'}
                />
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border border-slate-300 rounded-lg p-1 flex flex-wrap gap-1 shadow-2xs">
                <button
                    type="button"
                    onClick={() => onTabChange('RBAC_ROLES_MATRIX')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'RBAC_ROLES_MATRIX'
                            ? 'bg-[#2b6675] text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Role Permissions Grid (RBAC Matrix)
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('STAFF_OPERATORS')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'STAFF_OPERATORS'
                            ? 'bg-[#2b6675] text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Staff & Handheld Terminals
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('SYSTEM_POLICIES')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'SYSTEM_POLICIES'
                            ? 'bg-[#2b6675] text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    System Security & Shift Policies
                </button>

                <button
                    type="button"
                    onClick={() => onTabChange('AUDIT_TRAIL')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'AUDIT_TRAIL'
                            ? 'bg-[#2b6675] text-white shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    Access Change Audit Trail
                </button>
            </div>
        </div>
    );
};
