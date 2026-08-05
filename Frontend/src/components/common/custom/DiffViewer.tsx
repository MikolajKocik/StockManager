import React from 'react';
import { Badge } from './Badge';

export interface DiffFieldChange {
    field: string;
    label: string;
    oldValue: string | number | boolean | null | undefined;
    newValue: string | number | boolean | null | undefined;
    category?: string;
    changeType?: 'modified' | 'added' | 'removed';
}

export interface DiffViewerProps {
    fields?: DiffFieldChange[];
    rawGitDiff?: string;
    mode?: 'visual' | 'unified' | 'both';
    className?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
    fields = [],
    rawGitDiff,
    mode = 'visual',
    className = ''
}) => {
    const formatValue = (val: string | number | boolean | null | undefined): string => {
        if (val === null || val === undefined) return '<empty>';
        if (typeof val === 'boolean') return val ? 'true' : 'false';
        return String(val);
    };

    return (
        <div className={`space-y-4 font-mono text-xs ${className}`}>
            {(mode === 'visual' || mode === 'both') && fields.length > 0 && (
                <div className="border border-slate-300 rounded-md overflow-hidden bg-white shadow-2xs">
                    <div className="bg-[#2b6675]/10 border-b border-slate-300 px-3 py-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800">
                            Modified Attributes ({fields.length})
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                            Old vs New State
                        </span>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {fields.map((change, idx) => {
                            const isAdded = change.changeType === 'added';
                            const isRemoved = change.changeType === 'removed';

                            return (
                                <div key={idx} className="p-3 hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-slate-900">
                                                {change.label || change.field}
                                            </span>
                                            {change.category && (
                                                <Badge variant="slate" className="text-xs font-mono">
                                                    {change.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge
                                            variant={isAdded ? 'emerald' : isRemoved ? 'rose' : 'brand'}
                                            className="text-xs font-mono"
                                        >
                                            {isAdded ? 'Added' : isRemoved ? 'Removed' : 'Modified'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs mt-2">
                                        <div className="bg-red-50 border border-red-200 rounded p-2 text-red-900">
                                            <div className="text-xs uppercase font-bold text-red-700 mb-0.5 tracking-tight flex items-center justify-between">
                                                <span>Previous Value (-)</span>
                                            </div>
                                            <div className="break-all whitespace-pre-wrap font-medium">
                                                {isAdded ? (
                                                    <span className="text-red-400 italic">None (New Field)</span>
                                                ) : (
                                                    formatValue(change.oldValue)
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-900">
                                            <div className="text-xs uppercase font-bold text-emerald-700 mb-0.5 tracking-tight flex items-center justify-between">
                                                <span>Current Value (+)</span>
                                            </div>
                                            <div className="break-all whitespace-pre-wrap font-bold">
                                                {isRemoved ? (
                                                    <span className="text-emerald-400 italic">Deleted</span>
                                                ) : (
                                                    formatValue(change.newValue)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {(mode === 'unified' || mode === 'both') && rawGitDiff && (
                <div className="border border-slate-300 rounded-md overflow-hidden bg-white text-slate-800 shadow-2xs font-mono text-xs">
                    <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                            Unified Git Patch Diff
                        </span>
                        <Badge variant="brand" className="text-xs font-mono">
                            Git Diff
                        </Badge>
                    </div>
                    <div className="p-3 overflow-x-auto divide-y divide-slate-100 font-mono leading-relaxed bg-slate-50/50">
                        {rawGitDiff.split('\n').map((line, lIdx) => {
                            const isAddition = line.startsWith('+');
                            const isDeletion = line.startsWith('-');
                            const isHeader = line.startsWith('@@') || line.startsWith('diff') || line.startsWith('index');

                            let lineStyle = 'text-slate-700';
                            let bgStyle = '';

                            if (isAddition) {
                                lineStyle = 'text-emerald-900 font-semibold';
                                bgStyle = 'bg-emerald-50 border-l-2 border-emerald-600 pl-2';
                            } else if (isDeletion) {
                                lineStyle = 'text-rose-900 font-semibold';
                                bgStyle = 'bg-rose-50 border-l-2 border-rose-600 pl-2';
                            } else if (isHeader) {
                                lineStyle = 'text-[#2b6675] font-bold';
                                bgStyle = 'bg-slate-100 pl-2';
                            } else {
                                bgStyle = 'pl-2';
                            }

                            return (
                                <div key={lIdx} className={`py-0.5 whitespace-pre flex items-start ${bgStyle}`}>
                                    <span className="w-8 select-none text-slate-400 text-xs text-right pr-2">
                                        {lIdx + 1}
                                    </span>
                                    <span className={lineStyle}>{line || ' '}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
