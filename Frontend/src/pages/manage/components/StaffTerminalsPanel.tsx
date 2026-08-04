import React, { useState, useMemo } from 'react';
import type { StaffOperator, RolePermissionMatrix } from '../models/rbac';
import {
    Input,
    Button,
    Select,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell
} from '@/components/common/core';
import { Badge } from '@/components/common/custom';

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

    const brigadeOptions = useMemo(() => {
        const unique = Array.from(new Set(staff.map(s => s.assignedBrigade)));
        return [
            { label: 'All Brigades & Sectors', value: 'ALL' },
            ...unique.map(b => ({ label: b, value: b }))
        ];
    }, [staff]);

    const roleOptions = useMemo(() => {
        return roles.map(r => ({
            label: r.roleName,
            value: r.roleId
        }));
    }, [roles]);

    const filtered = useMemo(() => {
        return staff.filter(s => {
            const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                s.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
                s.terminalId.toLowerCase().includes(search.toLowerCase());
            const matchesBrigade = filterBrigade === 'ALL' || s.assignedBrigade === filterBrigade;
            return matchesSearch && matchesBrigade;
        });
    }, [staff, search, filterBrigade]);

    return (
        <div className="w-full space-y-3 text-xs">
            {/* Filter Bar */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-72">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search operator, badge code or terminal ID..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase font-mono">
                            Brigade:
                        </span>
                        <div className="w-56">
                            <Select
                                value={filterBrigade}
                                onChange={(e) => setFilterBrigade(e.target.value)}
                                options={brigadeOptions}
                            />
                        </div>
                    </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                    Showing <strong className="text-slate-900">{filtered.length}</strong> active operators
                </div>
            </div>

            {/* Operators Table using common core components */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Operator / Badge</TableHeaderCell>
                        <TableHeaderCell>Assigned Role Profile</TableHeaderCell>
                        <TableHeaderCell>Brigade / Team</TableHeaderCell>
                        <TableHeaderCell>Handheld Terminal</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtered.map(op => (
                        <TableRow key={op.id}>
                            <TableCell>
                                <div className="font-bold text-slate-900 text-xs">{op.fullName}</div>
                                <div className="text-[10px] font-mono text-slate-500">
                                    {op.employeeCode} &bull; {op.email}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="w-64">
                                    <Select
                                        value={op.roleId}
                                        onChange={(e) => onUpdateUserRole(op.id, e.target.value)}
                                        options={roleOptions}
                                    />
                                </div>
                            </TableCell>

                            <TableCell variant="strong">
                                {op.assignedBrigade}
                            </TableCell>

                            <TableCell variant="code">
                                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-xs text-slate-800 font-semibold font-mono">
                                    {op.terminalId}
                                </span>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Badge variant={op.isActive ? 'success' : 'danger'}>
                                        {op.isActive ? 'Online' : 'Disabled'}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        ({op.lastActive})
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant={op.isActive ? 'danger' : 'primary'}
                                    size="sm"
                                    onClick={() => onToggleUserActive(op.id)}
                                >
                                    {op.isActive ? 'Lock Terminal' : 'Unlock'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
