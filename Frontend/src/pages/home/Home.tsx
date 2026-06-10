import DashboardCard from './components/DashboardCard';
import { Header } from '@/components/common';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@/api/internal/suppliersApi';
import { inventoryApi } from '@/api/internal/inventoryApi';
import { productsApi } from '@/api/internal/productsApi';
import { shipmentsApi } from '@/api/internal/shipmentsApi';
import { operationsApi } from '@/api/internal/operationsApi';

export default function Home() {

    const { data: suppliers = { data: [] }, isLoading: l1, isError: e1 } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll
    });

    const { data: items = { data: [] }, isLoading: l2, isError: e2 } = useQuery({
        queryKey: ['items'],
        queryFn: inventoryApi.getItems
    });

    const { data: products = { data: [] }, isLoading: l3, isError: e3 } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getProducts
    });

    const { data: shipments = { data: [] }, isLoading: l4, isError: e4 } = useQuery({
        queryKey: ['shipments'],
        queryFn: shipmentsApi.getSuccessfulShipments
    });

    const { data: operations = [], isLoading: l5, isError: e5 } = useQuery({
        queryKey: ['operations'],
        queryFn: operationsApi.getOperations
    });

    const isLoading = l1 || l2 || l3 || l4 || l5;
    const isError = e1 || e2 || e3 || e4 || e5;

    // operations of last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOperationsCount = operations.filter(op =>
        new Date(op.date) >= sevenDaysAgo
    ).length ?? 0;

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p className="error-message">Something went wrong</p>;

    return (
        <div>
            <h1>Home Dashboard</h1>
        </div>
    );
}
