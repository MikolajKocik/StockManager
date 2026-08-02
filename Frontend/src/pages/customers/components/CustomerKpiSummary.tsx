import React from 'react';
import { Button } from '@/components/common';
import type { Customer } from '@/models/customer';

interface CustomerKpiSummaryProps {
    customers: Customer[];
    onOpenCreateModal: () => void;
    filterQuery: string;
    onFilterChange: (val: string) => void;
    selectedSegment: string;
    onSegmentChange: (val: string) => void;
    segments: string[];
}

export const CustomerKpiSummary: React.FC<CustomerKpiSummaryProps> = ({
    customers,
    onOpenCreateModal,
    filterQuery,
    onFilterChange,
    selectedSegment,
    onSegmentChange,
    segments
}) => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => (c.status || 'Active') === 'Active').length;
    const totalSpentSum = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const totalCreditSum = customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0);

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) return `€${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}k`;
        return `€${amount}`;
    };

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-4 space-y-4">
            {/* Header row with Title, Search & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">
                        Customers & Key Accounts Directory
                    </h1>
                    <p className="text-xs text-slate-500">
                        Manage B2B wholesale client relationships, credit terms, regional billing, and order histories
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
                            className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded-md outline-none w-64 transition-colors shadow-inner"
                        />
                        {filterQuery && (
                            <button
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
                        className="text-xs bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800"
                    >
                        <option value="">All Segments ({segments.length})</option>
                        {segments.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {/* Add Customer button */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onOpenCreateModal}
                        className="shadow-sm text-xs font-semibold whitespace-nowrap"
                    >
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Total Customers */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        B2B Accounts
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800 font-mono">{totalCustomers}</span>
                        <span className="text-xs text-slate-500">enterprises</span>
                    </div>
                </div>

                {/* 2. Active Ratio */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active Clients
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-emerald-700 font-mono">{activeCustomers}</span>
                        <span className="text-xs font-semibold text-emerald-600">
                            {totalCustomers > 0 ? `${Math.round((activeCustomers / totalCustomers) * 100)}%` : '100%'}
                        </span>
                    </div>
                </div>

                {/* 3. Cumulative Lifetime Revenue */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-blue-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Total Billed Volume
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-blue-700 font-mono">{formatCurrency(totalSpentSum)}</span>
                        <span className="text-xs text-blue-600 font-medium">sales revenue</span>
                    </div>
                </div>

                {/* 4. Total Credit Limit Extended */}
                <div className="bg-purple-50/60 border border-purple-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-purple-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Total Credit Limit
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-purple-800 font-mono">{formatCurrency(totalCreditSum)}</span>
                        <span className="text-xs text-purple-700 font-semibold">commercial credit</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
