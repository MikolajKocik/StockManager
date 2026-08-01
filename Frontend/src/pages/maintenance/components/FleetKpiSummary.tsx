import React from 'react';
import { Button } from '@/components/common';

interface FleetKpiSummaryProps {
    kpis: {
        total: number;
        operational: number;
        charging: number;
        maintenance: number;
        critical: number;
        avgBattery: number;
        readinessRate: number;
        activeIncidentsCount: number;
    };
    filterQuery: string;
    onFilterChange: (query: string) => void;
    onOpenReportModal: () => void;
}

export const FleetKpiSummary: React.FC<FleetKpiSummaryProps> = ({
    kpis,
    filterQuery,
    onFilterChange,
    onOpenReportModal
}) => {
    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-4 space-y-4">
            {/* Header row with Title, Search & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">
                        Maintenance Center & Fleet Management
                    </h1>
                    <p className="text-xs text-slate-500">
                        Visual machinery tracking, live battery telemetry, and drag-and-drop workspace zones
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Live Search input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => onFilterChange(e.target.value)}
                            placeholder="Search machine, code, operator..."
                            className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded-md outline-none w-60 transition-colors shadow-inner"
                        />
                        {filterQuery && (
                            <button
                                onClick={() => onFilterChange('')}
                                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Report Incident button */}
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={onOpenReportModal}
                        className="shadow-sm text-xs font-semibold whitespace-nowrap"
                    >
                        Report Fault / Service
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Total Fleet */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Total Fleet
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800 font-mono">{kpis.total}</span>
                        <span className="text-xs text-slate-500">units</span>
                    </div>
                </div>

                {/* 2. Operational / Ready */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Operational
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-emerald-700 font-mono">{kpis.operational}</span>
                        <span className="text-xs font-semibold text-emerald-600">
                            {kpis.total > 0 ? `${Math.round((kpis.operational / kpis.total) * 100)}%` : '0%'}
                        </span>
                    </div>
                </div>

                {/* 3. Charging */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-blue-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Charging
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-blue-700 font-mono">{kpis.charging}</span>
                        <span className="text-xs text-blue-600">batteries</span>
                    </div>
                </div>

                {/* 4. Critical / Faults */}
                <div className={`rounded-lg p-2.5 flex flex-col justify-between border ${
                    kpis.critical > 0 
                        ? 'bg-rose-50 border-rose-300 text-rose-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                    <span className="text-[11px] font-medium uppercase tracking-wider flex items-center gap-1">
                        {kpis.critical > 0 ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        )}
                        Faults / Outages
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className={`text-xl font-bold font-mono ${kpis.critical > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                            {kpis.critical}
                        </span>
                        <span className="text-xs font-semibold">
                            {kpis.critical > 0 ? 'Requires Action' : 'None'}
                        </span>
                    </div>
                </div>

                {/* 5. Average Battery */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Fleet Avg Battery
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800 font-mono">{kpis.avgBattery}%</span>
                        <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden self-center">
                            <div 
                                className={`h-full rounded-full ${
                                    kpis.avgBattery > 60 ? 'bg-emerald-500' : kpis.avgBattery > 30 ? 'bg-amber-500' : 'bg-rose-500'
                                }`} 
                                style={{ width: `${kpis.avgBattery}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 6. Fleet Readiness */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Availability Rate (OEE)
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800 font-mono">{kpis.readinessRate}%</span>
                        <span className="text-xs text-slate-500">uptime</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
