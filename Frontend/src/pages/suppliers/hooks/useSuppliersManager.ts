import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@/api/internal/suppliersApi';
import type { Supplier } from '@/models/supplier';

export function useSuppliersManager() {
    const { data: initialSuppliersData, isLoading, isError } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll
    });

    const [localSuppliers, setLocalSuppliers] = useState<Supplier[] | null>(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortField, setSortField] = useState<keyof Supplier>('name');
    const [sortAsc, setSortAsc] = useState(true);

    const suppliers: Supplier[] = useMemo(() => {
        if (localSuppliers !== null) return localSuppliers;
        return initialSuppliersData?.data || [];
    }, [localSuppliers, initialSuppliersData]);

    const countries = useMemo(() => {
        const set = new Set<string>();
        suppliers.forEach(s => {
            if (s.address?.country) set.add(s.address.country);
        });
        return Array.from(set).sort();
    }, [suppliers]);

    const filteredSuppliers = useMemo(() => {
        let list = [...suppliers];

        if (filterQuery.trim()) {
            const q = filterQuery.toLowerCase();
            list = list.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.slug.toLowerCase().includes(q) ||
                (s.taxId && s.taxId.toLowerCase().includes(q)) ||
                (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
                (s.email && s.email.toLowerCase().includes(q)) ||
                (s.address?.city && s.address.city.toLowerCase().includes(q)) ||
                (s.address?.country && s.address.country.toLowerCase().includes(q))
            );
        }

        if (selectedCountry) {
            list = list.filter(s => s.address?.country === selectedCountry);
        }

        if (selectedStatus) {
            list = list.filter(s => (s.status || 'Active') === selectedStatus);
        }

        list.sort((a, b) => {
            let valA: any = a[sortField] || '';
            let valB: any = b[sortField] || '';

            if (sortField === 'address') {
                valA = a.address?.country || '';
                valB = b.address?.country || '';
            }

            if (typeof valA === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        return list;
    }, [suppliers, filterQuery, selectedCountry, selectedStatus, sortField, sortAsc]);

    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status !== 'Inactive').length;
    const avgLeadTime = suppliers.length > 0
        ? Math.round(suppliers.reduce((acc, s) => acc + (s.leadTimeDays || 5), 0) / suppliers.length)
        : 0;
    const avgRating = suppliers.length > 0
        ? (suppliers.reduce((acc, s) => acc + (s.rating || 4.5), 0) / suppliers.length).toFixed(1)
        : '5.0';

    const handleSort = (field: keyof Supplier) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleSaveSupplier = (supplierData: Partial<Supplier>, editingId?: string) => {
        if (editingId) {
            setLocalSuppliers(prev => {
                const base = prev || suppliers;
                return base.map(s => s.id === editingId ? { ...s, ...supplierData } as Supplier : s);
            });
        } else {
            const newSupplier: Supplier = {
                id: supplierData.id || `SUP-${Date.now().toString().slice(-4)}`,
                name: supplierData.name || 'New Supplier',
                slug: supplierData.slug || 'new-supplier',
                taxId: supplierData.taxId,
                contactPerson: supplierData.contactPerson,
                email: supplierData.email,
                phone: supplierData.phone,
                website: supplierData.website,
                paymentTerms: supplierData.paymentTerms || 'Net 30',
                leadTimeDays: supplierData.leadTimeDays || 5,
                rating: supplierData.rating || 5.0,
                status: supplierData.status || 'Active',
                activeItemsCount: 0,
                address: supplierData.address
            };
            setLocalSuppliers(prev => [newSupplier, ...(prev || suppliers)]);
        }
    };

    const handleDeleteSupplier = (id: string) => {
        setLocalSuppliers(prev => (prev || suppliers).filter(s => s.id !== id));
    };

    const resetFilters = () => {
        setFilterQuery('');
        setSelectedCountry('');
        setSelectedStatus('');
    };

    return {
        suppliers,
        filteredSuppliers,
        countries,
        filterQuery,
        setFilterQuery,
        selectedCountry,
        setSelectedCountry,
        selectedStatus,
        setSelectedStatus,
        sortField,
        sortAsc,
        handleSort,
        handleSaveSupplier,
        handleDeleteSupplier,
        resetFilters,
        isLoading,
        isError,
        hasLocalData: localSuppliers !== null,
        kpi: {
            totalSuppliers,
            activeSuppliers,
            avgLeadTime,
            avgRating
        }
    };
}
