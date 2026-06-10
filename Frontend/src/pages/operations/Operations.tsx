import { useState } from 'react';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@/components/common/Table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { operationsApi } from '@/api/internal/operationsApi';
import { productsApi } from '@/api/internal/productsApi';
import ProductCreateForm from '../products/components/ProductCreateForm';
import { Header, Button, Select, Input, Modal } from '@/components/common';

export default function Operations() {
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [newOp, setNewOp] = useState({
        type: 0, // PZ
        date: new Date().toISOString().split('T')[0],
        description: '',
        items: [{ productId: '', quantity: 1 }]
    });

    const { data: operations = [] } = useQuery({
        queryKey: ['operations'],
        queryFn: operationsApi.getOperations
    });

    const { data: products = { data: [] } } = useQuery({
        queryKey: ['products'],
        queryFn: productsApi.getProducts
    });

    const { mutate: createOperation, isPending: isCreating } = useMutation({
        mutationFn: (op: WarehouseOperation) => operationsApi.createOperation(op),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['operations'] });
            setShowModal(false);
        },
        onError: (err) => {
            alert("Error creating operation");
            console.error(err);
        }
    });

    const handleCreate = async () => {
        createOperation({
            ...newOp,
            type: parseInt(newOp.type.toString()),
            items: newOp.items.map(i => ({ ...i, productId: parseInt(i.productId) }))
        } as WarehouseOperation);
    };

    const addItem = () => setNewOp({
        ...newOp,
        items: [...newOp.items, { productId: '', quantity: 1 }]
    });

    const operationTypes = [
        { value: 0, label: 'PZ (Goods Receipt)' },
        { value: 1, label: 'WZ (Goods Issue)' },
        { value: 2, label: 'RW (Internal Consumption)' },
        { value: 3, label: 'MM (Stock Transfer)' }
    ];

    return (
        <div>
            <h2>Operations</h2>
        </div>
    );
}
