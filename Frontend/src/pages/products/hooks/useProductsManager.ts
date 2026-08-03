import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useProducts, useDeleteProduct } from './index';
import { useInventoryItems } from '@/pages/inventoryItems/hooks/useInventoryItems';
import type { Product } from '@/models/product';

export function useProductsManager() {
    const { data, isError, isLoading, refetch, isFetching } = useProducts();
    const { data: inventoryData, isLoading: isInventoryLoading } = useInventoryItems();
    const deleteProductMutation = useDeleteProduct();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
    const [activeSort, setActiveSort] = useState<string | null>('id');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const productList: Product[] = useMemo(() => data?.data ?? [], [data]);
    const inventoryItems = useMemo(() => inventoryData?.data ?? [], [inventoryData]);

    const getProductStock = useCallback((productId: number): number => {
        return inventoryItems
            .filter(item => item.productId === productId)
            .reduce((acc, curr) => acc + (curr.quantityOnHand || 0), 0);
    }, [inventoryItems]);

    const genres = useMemo(() => {
        const set = new Set<string>();
        productList.forEach(p => {
            if (p.genre) set.add(p.genre);
        });
        return Array.from(set).sort();
    }, [productList]);

    const units = useMemo(() => {
        const set = new Set<string>();
        productList.forEach(p => {
            if (p.unit) set.add(p.unit);
        });
        return Array.from(set).sort();
    }, [productList]);

    const toggleSort = (key: string) => {
        if (activeSort === key) {
            setSortAsc(prev => !prev);
        } else {
            setActiveSort(key);
            setSortAsc(true);
        }
    };

    const displayedProducts = useMemo(() => {
        let list = [...productList];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.slug?.toLowerCase().includes(q) ||
                p.genre?.toLowerCase().includes(q) ||
                p.batchNumber?.toLowerCase().includes(q) ||
                p.supplierName?.toLowerCase().includes(q) ||
                p.supplierId?.toLowerCase().includes(q)
            );
        }

        if (selectedGenre) {
            list = list.filter(p => p.genre === selectedGenre);
        }

        if (selectedUnit) {
            list = list.filter(p => p.unit === selectedUnit);
        }

        if (stockFilter === 'IN_STOCK') {
            list = list.filter(p => getProductStock(p.id) > 0);
        } else if (stockFilter === 'OUT_OF_STOCK') {
            list = list.filter(p => getProductStock(p.id) <= 0);
        }

        if (activeSort) {
            list.sort((a, b) => {
                let valA: any;
                let valB: any;

                if (activeSort === 'stock') {
                    valA = getProductStock(a.id);
                    valB = getProductStock(b.id);
                } else {
                    valA = a[activeSort as keyof Product] ?? '';
                    valB = b[activeSort as keyof Product] ?? '';
                }

                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortAsc ? valA - valB : valB - valA;
                }
                return sortAsc
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
        }

        return list;
    }, [productList, searchQuery, selectedGenre, selectedUnit, stockFilter, activeSort, sortAsc, getProductStock]);

    const totalProducts = productList.length;
    const totalStockUnits = useMemo(() => {
        return productList.reduce((acc, p) => acc + getProductStock(p.id), 0);
    }, [productList, getProductStock]);

    const outOfStockCount = useMemo(() => {
        return productList.filter(p => getProductStock(p.id) <= 0).length;
    }, [productList, getProductStock]);

    const handleDeleteProduct = (id: number) => {
        return deleteProductMutation.mutateAsync(id.toString(), {
            onSuccess: () => {
                toast.success('Product deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete product');
            }
        });
    };

    const handleRefetch = () => {
        toast.promise(
            refetch(),
            {
                loading: 'Refreshing catalog...',
                success: 'Catalog refreshed',
                error: 'Failed to refresh'
            },
            { id: 'refetch-toast' }
        );
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedGenre('');
        setSelectedUnit('');
        setStockFilter('ALL');
    };

    return {
        products: productList,
        displayedProducts,
        genres,
        units,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        selectedUnit,
        setSelectedUnit,
        stockFilter,
        setStockFilter,
        activeSort,
        sortAsc,
        toggleSort,
        resetFilters,
        getProductStock,
        handleDeleteProduct,
        handleRefetch,
        isLoading: isLoading || isInventoryLoading,
        isFetching,
        isError,
        isDeleting: deleteProductMutation.isPending,
        kpi: {
            totalProducts,
            totalStockUnits,
            outOfStockCount,
            genresCount: genres.length
        }
    };
}
