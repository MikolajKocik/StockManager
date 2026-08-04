import React, { useMemo } from 'react';
import { Button, Input, Select } from '@/components/common/core';

interface SupplierKpiSummaryProps {
    totalSuppliers: number;
    activeSuppliers: number;
    avgLeadTime: number;
    avgRating: string;
    onOpenCreateModal: () => void;
    filterQuery: string;
    onFilterChange: (val: string) => void;
    selectedCountry: string;
    onCountryChange: (val: string) => void;
    countries: string[];
}

export const SupplierKpiSummary: React.FC<SupplierKpiSummaryProps> = ({
    totalSuppliers,
    activeSuppliers,
    avgLeadTime,
    avgRating,
    onOpenCreateModal,
    filterQuery,
    onFilterChange,
    selectedCountry,
    onCountryChange,
    countries
}) => {
    const activePercent = totalSuppliers > 0
        ? Math.round((activeSuppliers / totalSuppliers) * 100)
        : 100;

    const countryOptions = useMemo(() => [
        { label: `All Countries (${countries.length})`, value: '' },
        ...countries.map(c => ({ label: c, value: c }))
    ], [countries]);

    return (
        <div className="bg-white border border-slate-300 rounded-lg shadow-2xs p-4 space-y-4">
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
                    <div className="w-64">
                        <Input
                            value={filterQuery}
                            onChange={(e) => onFilterChange(e.target.value)}
                            placeholder="Search supplier, contact, city..."
                            className="text-xs"
                        />
                    </div>

                    {/* Country Filter Select */}
                    <div className="w-44">
                        <Select
                            value={selectedCountry}
                            onChange={(e) => onCountryChange(e.target.value)}
                            options={countryOptions}
                            className="text-xs"
                        />
                    </div>

                    {/* Add Supplier button */}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={onOpenCreateModal}
                        className="shadow-2xs font-semibold whitespace-nowrap"
                    >
                        Add Supplier
                    </Button>
                </div>
            </div>

            {/* Technical Industrial KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Suppliers */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Total Vendors
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{totalSuppliers}</span>
                        <span className="text-xs text-slate-500 font-medium">partners</span>
                    </div>
                </div>

                {/* Active Contracts */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Active Contracts
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{activeSuppliers}</span>
                        <span className="text-xs text-slate-500 font-medium">
                            {activePercent}% active
                        </span>
                    </div>
                </div>

                {/* Average Lead Time */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Avg Lead Time
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{avgLeadTime}</span>
                        <span className="text-xs text-slate-500 font-medium">days delivery</span>
                    </div>
                </div>

                {/* Sourcing Reliability */}
                <div className="bg-slate-50/70 border border-slate-300 rounded-md p-3 flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Reliability Score
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold font-mono text-slate-900">{avgRating} / 5.0</span>
                        <span className="text-xs text-slate-500 font-medium">Vendor SLA</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
