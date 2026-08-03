import React from 'react';
import { Button } from '@/components/common';

interface CustomerKpiSummaryProps {
    totalCustomers: number;
    activeCustomers: number;
    totalSpentSum: number;
    totalCreditSum: number;
    onOpenCreateModal: () => void;
    filterQuery: string;
    onFilterChange: (val: string) => void;
    selectedSegment: string;
    onSegmentChange: (val: string) => void;
    segments: string[];
}

export const CustomerKpiSummary: React.FC<CustomerKpiSummaryProps> = ({
    totalCustomers,
    activeCustomers,
    totalSpentSum,
    totalCreditSum,
    onOpenCreateModal,
    filterQuery,
    onFilterChange,
    selectedSegment,
    onSegmentChange,
    segments
}) => {
    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `€${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}k`;
        return `€${amount}`;
    };

    const activePercent = totalCustomers > 0
        ? Math.round((activeCustomers / totalCustomers) * 100)
        : 100;

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-2xs p-4 space-y-4">
            {/* Header row with Title, Search & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">
                        Customers & Key Accounts Directory
                    </h1>
                    <p className="text-xs text-slate-500">
                        Manage B2B wholesale client relationships, credit limits, regional billing, and order histories
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Live Search input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => onFilterChange(e.target.value)}
                            placeholder="Search customer, tax ID, email, city..."
                            className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded outline-none w-64 transition-colors shadow-inner font-medium text-slate-800 placeholder:text-slate-400"
                        />
                        {filterQuery && (
                            <button
                                type="button"
                                onClick={() => onFilterChange('')}
                                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                &#10005;
                            </button>
                        )}
                    </div>

                    {/* Segment Filter Select */}
                    <select
                        value={selectedSegment}
                        onChange={(e) => onSegmentChange(e.target.value)}
                        aria-label="Filter customers by segment"
                        className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800 cursor-pointer"
                    >
                        <option value="">All Segments ({segments.length})</option>
                        {segments.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* Add Customer button */}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onOpenCreateModal}
                        className="shadow-2xs font-semibold whitespace-nowrap"
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* Technical Industrial KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Total Customers */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        B2B Accounts
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{totalCustomers}</span>
                        <span className="text-xs text-slate-500 font-medium">enterprises</span>
                    </div>
                </div>

                {/* 2. Active Ratio */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Active Clients
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{activeCustomers}</span>
                        <span className="text-xs text-slate-500 font-medium">
                            {activePercent}% active
                        </span>
                    </div>
                </div>

                {/* 3. Cumulative Lifetime Revenue */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Total Volume
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{formatCurrency(totalSpentSum)}</span>
                        <span className="text-xs text-slate-500 font-medium">sales revenue</span>
                    </div>
                </div>

                {/* 4. Total Credit Limit Extended */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Total Credit Limit
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{formatCurrency(totalCreditSum)}</span>
                        <span className="text-xs text-slate-500 font-medium">commercial credit</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
