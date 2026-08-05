import React, { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Badge, 
    Button, 
    DiffViewer 
} from '@/components/common';
import type { AuditLogEvent } from '@/models/auditLog';

export interface GitDiffInspectorProps {
    event: AuditLogEvent | null;
    onRollbackClick?: (event: AuditLogEvent) => void;
    className?: string;
}

export const GitDiffInspector: React.FC<GitDiffInspectorProps> = ({
    event,
    onRollbackClick,
    className = ''
}) => {
    const [viewMode, setViewMode] = useState<'visual' | 'unified' | 'both'>('visual');

    if (!event) {
        return (
            <Card className={`border-slate-300 ${className}`}>
                <CardBody className="p-12 text-center text-slate-500 font-mono text-xs">
                    Select an operation event from the timeline to inspect its Git-Diff and auditor provenance.
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className={`border-slate-300 shadow-xs ${className}`}>
            <CardHeader className="bg-slate-50 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-slate-900">
                                {event.actionLabel.replace(/_/g, ' ')}
                            </span>
                            <Badge variant="brand" className="font-mono text-xs">{event.commitHash}</Badge>
                            <Badge variant="slate" className="font-mono text-xs">{event.entityType}</Badge>
                        </div>
                        <p className="text-xs font-mono text-slate-500">
                            Target Entity: <strong className="text-slate-800">{event.entityName}</strong> ({event.entityCode})
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-300 text-xs font-mono shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode('visual')}
                            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                viewMode === 'visual'
                                    ? 'bg-[#2b6675] text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Visual Diff
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('unified')}
                            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                viewMode === 'unified'
                                    ? 'bg-[#2b6675] text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Unified Git Patch
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('both')}
                            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                                viewMode === 'both'
                                    ? 'bg-[#2b6675] text-white font-bold'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Combined
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-50 text-slate-800 rounded-lg space-y-2 border border-slate-200">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <span className="text-[#2b6675] font-bold text-xs">
                                Auditor: {event.user.name}
                            </span>
                            <Badge variant="brand" className="text-xs font-mono">
                                {event.user.role}
                            </Badge>
                        </div>
                        <span className="text-slate-500 text-xs">
                            {event.timestamp} ({event.relativeTime})
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                            <span className="text-slate-500 block text-xs">Department:</span>
                            <span className="font-semibold text-slate-800">{event.user.department}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs">IP & Origin:</span>
                            <span className="font-semibold text-slate-800">{event.user.ipAddress}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block text-xs">Terminal Device:</span>
                            <span className="font-semibold text-slate-800">{event.user.clientDevice}</span>
                        </div>
                    </div>

                    <div className="pt-1 text-slate-700 font-sans text-xs">
                        <span className="font-bold text-slate-600 font-mono text-xs block">
                            Justification / Audit Rationale:
                        </span>
                        <p className="italic bg-white p-2 rounded mt-1 border border-slate-200 text-slate-800">
                            "{event.justificationReason}"
                        </p>
                    </div>

                    {event.approvalRef && (
                        <div className="pt-1 text-xs flex items-center gap-2">
                            <span className="text-slate-500">Formal Approval Code:</span>
                            <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-300 font-bold">
                                {event.approvalRef}
                            </span>
                        </div>
                    )}
                </div>

                <DiffViewer
                    fields={event.diffFields}
                    rawGitDiff={event.rawGitPatch}
                    mode={viewMode}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-200 gap-2">
                    <div className="text-xs text-slate-500 font-mono">
                        Parent Commit: <strong className="text-slate-700">{event.parentCommitHash || '0000000 (Root)'}</strong>
                    </div>
                    {onRollbackClick && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                            onClick={() => onRollbackClick(event)}
                        >
                            Simulate State Rollback
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};
