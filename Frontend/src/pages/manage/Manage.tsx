import { useState } from 'react';
import { ManageHeader, type ManageModuleTab } from './components/ManageHeader';
import { RbacMatrixGrid } from './components/RbacMatrixGrid';
import { StaffTerminalsPanel } from './components/StaffTerminalsPanel';
import { SystemConfigPanel } from './components/SystemConfigPanel';
import { AuditTrailPanel } from './components/AuditTrailPanel';

import {
    WMS_MODULES,
    INITIAL_ROLE_PERMISSIONS,
    INITIAL_STAFF_OPERATORS,
    INITIAL_AUDIT_LOGS
} from './mocks/rbac.mocks';
import type { RolePermissionMatrix, StaffOperator, SystemAuditLog, WmsModuleKey, AccessLevel } from './models/rbac';
import toast from 'react-hot-toast';

export default function Manage() {
    const [activeTab, setActiveTab] = useState<ManageModuleTab>('RBAC_ROLES_MATRIX');
    const [roles, setRoles] = useState<RolePermissionMatrix[]>(INITIAL_ROLE_PERMISSIONS);
    const [originalRoles, setOriginalRoles] = useState<RolePermissionMatrix[]>(INITIAL_ROLE_PERMISSIONS);
    const [staff, setStaff] = useState<StaffOperator[]>(INITIAL_STAFF_OPERATORS);
    const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);

    let unsavedCount = 0;
    roles.forEach(r => {
        const orig = originalRoles.find(o => o.roleId === r.roleId);
        if (orig) {
            WMS_MODULES.forEach(m => {
                if (r.permissions[m.key] !== orig.permissions[m.key]) {
                    unsavedCount++;
                }
            });
        }
    });

    const hasUnsavedChanges = unsavedCount > 0;

    const handleTogglePermission = (roleId: string, moduleKey: WmsModuleKey, newLevel: AccessLevel) => {
        setRoles(prev => prev.map(r => {
            if (r.roleId !== roleId) return r;
            return {
                ...r,
                permissions: {
                    ...r.permissions,
                    [moduleKey]: newLevel
                }
            };
        }));
    };

    const handleBulkUpdateRole = (roleId: string, level: AccessLevel) => {
        setRoles(prev => prev.map(r => {
            if (r.roleId !== roleId) return r;
            const updated: Record<WmsModuleKey, AccessLevel> = { ...r.permissions };
            WMS_MODULES.forEach(m => {
                updated[m.key] = level;
            });
            return { ...r, permissions: updated };
        }));
        toast.success(`Updated all permissions for role to ${level}`);
    };

    const handleBulkUpdateModule = (moduleKey: WmsModuleKey, level: AccessLevel) => {
        setRoles(prev => prev.map(r => ({
            ...r,
            permissions: {
                ...r.permissions,
                [moduleKey]: level
            }
        })));
        toast.success(`Set ${moduleKey} permission to ${level} for all roles`);
    };

    const handleDeployChanges = () => {
        setOriginalRoles(roles);
        const newLog: SystemAuditLog = {
            id: `audit-${Date.now()}`,
            timestamp: 'Just now',
            actorName: 'Warehouse Director (Active User)',
            action: 'DEPLOY_PERMISSIONS',
            targetRoleOrUser: 'All Active Terminals (54)',
            changeSummary: `Synchronized ${unsavedCount} RBAC policy changes across all handheld devices and web sessions`
        };
        setAuditLogs(prev => [newLog, ...prev]);
        toast.success('Successfully deployed RBAC permissions to all warehouse terminals.');
    };

    const handleResetChanges = () => {
        setRoles(originalRoles);
        toast('Discarded unsaved matrix edits.');
    };

    const handleUpdateUserRole = (userId: string, newRoleId: string) => {
        const role = roles.find(r => r.roleId === newRoleId);
        setStaff(prev => prev.map(s => {
            if (s.id !== userId) return s;
            return {
                ...s,
                roleId: newRoleId,
                roleName: role ? role.roleName : s.roleName
            };
        }));
        toast.success(`Operator role reassigned to ${role?.roleName}`);
    };

    const handleToggleUserActive = (userId: string) => {
        setStaff(prev => prev.map(s => {
            if (s.id !== userId) return s;
            const nextStatus = !s.isActive;
            toast(nextStatus ? 'Terminal unlocked for operator.' : 'Terminal locked for operator.');
            return { ...s, isActive: nextStatus };
        }));
    };

    return (
        <div className="w-full space-y-4 pb-12">
            <ManageHeader
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onDeployChanges={handleDeployChanges}
                onResetChanges={handleResetChanges}
                hasUnsavedChanges={hasUnsavedChanges}
                unsavedChangesCount={unsavedCount}
            />

            {activeTab === 'RBAC_ROLES_MATRIX' && (
                <RbacMatrixGrid
                    modules={WMS_MODULES}
                    roles={roles}
                    onTogglePermission={handleTogglePermission}
                    onBulkUpdateRole={handleBulkUpdateRole}
                    onBulkUpdateModule={handleBulkUpdateModule}
                />
            )}

            {activeTab === 'STAFF_OPERATORS' && (
                <StaffTerminalsPanel
                    staff={staff}
                    roles={roles}
                    onUpdateUserRole={handleUpdateUserRole}
                    onToggleUserActive={handleToggleUserActive}
                />
            )}

            {activeTab === 'SYSTEM_POLICIES' && (
                <SystemConfigPanel />
            )}

            {activeTab === 'AUDIT_TRAIL' && (
                <AuditTrailPanel logs={auditLogs} />
            )}
        </div>
    );
}
