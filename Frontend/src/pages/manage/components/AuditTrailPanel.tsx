import React from 'react';
import type { SystemAuditLog } from '../models/rbac';
import { Badge } from '@/components/common/custom';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell
} from '@/components/common/core';

interface AuditTrailPanelProps {
    logs: SystemAuditLog[];
}

const ACTION_BADGE_MAP: Record<string, 'brand' | 'warning' | 'neutral' | 'success' | 'danger'> = {
    'MATRIX_DEPLOY': 'brand',
    'EMERGENCY_OVERRIDE': 'warning',
    'TERMINAL_LOCK': 'danger',
    'TERMINAL_UNLOCK': 'success',
    'ROLE_MUTATION': 'neutral'
};

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ logs }) => {
    return (
        <div className="w-full space-y-2 text-xs">
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 uppercase font-mono text-[0.6875rem]">
                        Security & Access Mutation Audit Log
                    </h3>
                    <p className="text-slate-500 text-[0.625rem]">
                        Immutable event record of permission delegations, emergency overrides, and terminal sync commands.
                    </p>
                </div>
                <span className="text-[0.625rem] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                    {logs.length} Recorded Events
                </span>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Timestamp</TableHeaderCell>
                        <TableHeaderCell>Actor / Authorizer</TableHeaderCell>
                        <TableHeaderCell>Action Type</TableHeaderCell>
                        <TableHeaderCell>Target Entity</TableHeaderCell>
                        <TableHeaderCell>Details & Changes</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map(log => (
                        <TableRow key={log.id}>
                            <TableCell variant="muted">{log.timestamp}</TableCell>
                            <TableCell variant="strong">{log.actorName}</TableCell>
                            <TableCell>
                                <Badge variant={ACTION_BADGE_MAP[log.action] || 'neutral'}>
                                    {log.action}
                                </Badge>
                            </TableCell>
                            <TableCell variant="code">{log.targetRoleOrUser}</TableCell>
                            <TableCell>{log.changeSummary}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
