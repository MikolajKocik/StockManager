import React from 'react';
import { Button } from '@/components/common';
import type { Supplier } from '@/models/supplier';

interface SupplierKpiSummaryProps {
    suppliers: Supplier[];
    onOpenCreateModal: () => void;
    filterQuery: string;
    onFilterChange: (val: string) => void;
    selectedCountry: string;
    onCountryChange: (val: string) => void;
    countries: string[];
}

export const SupplierKpiSummary: React.FC<SupplierKpiSummaryProps> = ({
    suppliers,
    onOpenCreateModal,
    filterQuery,
    onFilterChange,
    selectedCountry,
    onCountryChange,
    countries
}) => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status !== 'Inactive').length;
    const avgLeadTime = suppliers.length > 0
        ? Math.round(suppliers.reduce((acc, s) => acc + (s.leadTimeDays || 5), 0) / suppliers.length)
        : 0;
    const avgRating = suppliers.length > 0
        ? (suppliers.reduce((acc, s) => acc + (s.rating || 4.5), 0) / suppliers.length).toFixed(1)
        : '5.0';

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-4 space-y-4">
            {/* Header row with Title, Search & Quick Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">
                        Suppliers & Procurement Directory
                    </h1>
                    <p className="text-xs text-slate-500">
                        Manage vendor contracts, logistics lead times, catalog allocations, and contact profiles
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Live Search input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => onFilterChange(e.target.value)}
                            placeholder="Search supplier, contact, city, tax ID..."
                            className="text-xs bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-slate-800 focus:bg-white px-3 py-1.5 rounded-md outline-none w-64 transition-colors shadow-inner"
                        />
                        {filterQuery && (
                            <button
                                onClick={() => onFilterChange('')}
                                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Country Filter Select */}
                    <select
                        value={selectedCountry}
                        onChange={(e) => onCountryChange(e.target.value)}
                        aria-label="Filter suppliers by country"
                        className="text-xs bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-slate-800"
                    >
                        <option value="">All Countries ({countries.length})</option>
                        {countries.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {/* Add Supplier button */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onOpenCreateModal}
                        className="shadow-sm text-xs font-semibold whitespace-nowrap"
                    >
                        Add Supplier
                    </Button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Suppliers */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Total Vendors
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-slate-800 font-mono">{totalSuppliers}</span>
                        <span className="text-xs text-slate-500">partners</span>
                    </div>
                </div>

                {/* Active Contracts */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active Contracts
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-emerald-700 font-mono">{activeSuppliers}</span>
                        <span className="text-xs font-semibold text-emerald-600">
                            {totalSuppliers > 0 ? `${Math.round((activeSuppliers / totalSuppliers) * 100)}%` : '100%'}
                        </span>
                    </div>
                </div>

                {/* Average Lead Time */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-blue-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Avg Lead Time
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-blue-700 font-mono">{avgLeadTime}</span>
                        <span className="text-xs text-blue-600">days delivery</span>
                    </div>
                </div>

                {/* 4. Sourcing Reliability */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5 flex flex-col justify-between">
                    <span className="text-[11px] font-medium text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Reliability Score
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xl font-bold text-amber-800 font-mono">{avgRating} / 5.0</span>
                        <span className="text-xs text-amber-700 font-semibold">Vendor SLA</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
