import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/api/internal/customersApi';
import type { Customer } from '@/models/customer';

export function useCustomersManager() {
    const { data: initialCustomersData, isLoading, isError } = useQuery({
        queryKey: ['customers'],
        queryFn: customersApi.getAll
    });

    const [localCustomers, setLocalCustomers] = useState<Customer[] | null>(null);
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [sortField, setSortField] = useState<keyof Customer>('name');
    const [sortAsc, setSortAsc] = useState(true);

    const customers: Customer[] = useMemo(() => {
        if (localCustomers !== null) return localCustomers;
        return initialCustomersData?.data || [];
    }, [localCustomers, initialCustomersData]);

    const segments = useMemo(() => {
        const set = new Set<string>();
        customers.forEach(c => {
            if (c.segment) set.add(c.segment);
        });
        return Array.from(set).sort();
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        let list = [...customers];

        if (filterQuery.trim()) {
            const q = filterQuery.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.code && c.code.toLowerCase().includes(q)) ||
                (c.taxId && c.taxId.toLowerCase().includes(q)) ||
                (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
                (c.email && c.email.toLowerCase().includes(q)) ||
                (c.address?.city && c.address.city.toLowerCase().includes(q)) ||
                (c.address?.country && c.address.country.toLowerCase().includes(q))
            );
        }

        if (selectedSegment) {
            list = list.filter(c => c.segment === selectedSegment);
        }

        if (selectedStatus) {
            list = list.filter(c => (c.status || 'Active') === selectedStatus);
        }

        list.sort((a, b) => {
            let valA: any = a[sortField] || '';
            let valB: any = b[sortField] || '';

            if (sortField === 'address') {
                valA = a.address?.city || '';
                valB = b.address?.city || '';
            }

            if (typeof valA === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        return list;
    }, [customers, filterQuery, selectedSegment, selectedStatus, sortField, sortAsc]);

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => (c.status || 'Active') === 'Active').length;
    const totalSpentSum = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const totalCreditSum = customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0);

    const handleSort = (field: keyof Customer) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleSaveCustomer = (customerData: Partial<Customer>, editingId?: number) => {
        if (editingId) {
            setLocalCustomers(prev => {
                const base = prev || customers;
                return base.map(c => c.id === editingId ? { ...c, ...customerData } as Customer : c);
            });
        } else {
            const newCustomer: Customer = {
                id: Number(customerData.id) || Date.now(),
                name: customerData.name || 'New Customer Account',
                code: customerData.code || `CUST-${Date.now().toString().slice(-4)}`,
                taxId: customerData.taxId || 'N/A',
                contactPerson: customerData.contactPerson || 'Procurement Office',
                email: customerData.email || '',
                phone: customerData.phone || '',
                creditLimit: customerData.creditLimit || 50000,
                totalSpent: 0,
                totalOrdersCount: 0,
                currency: 'EUR',
                segment: customerData.segment || 'Enterprise',
                status: customerData.status || 'Active',
                addressId: customerData.addressId || `addr-${Date.now()}`,
                address: customerData.address
            };
            setLocalCustomers(prev => [newCustomer, ...(prev || customers)]);
        }
    };

    const handleDeleteCustomer = (id: number) => {
        setLocalCustomers(prev => (prev || customers).filter(c => c.id !== id));
    };

    const resetFilters = () => {
        setFilterQuery('');
        setSelectedSegment('');
        setSelectedStatus('');
    };

    return {
        customers,
        filteredCustomers,
        segments,
        filterQuery,
        setFilterQuery,
        selectedSegment,
        setSelectedSegment,
        selectedStatus,
        setSelectedStatus,
        sortField,
        sortAsc,
        handleSort,
        handleSaveCustomer,
        handleDeleteCustomer,
        resetFilters,
        isLoading,
        isError,
        hasLocalData: localCustomers !== null,
        kpi: {
            totalCustomers,
            activeCustomers,
            totalSpentSum,
            totalCreditSum
        }
    };
}
