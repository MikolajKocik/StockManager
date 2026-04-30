import { useState } from 'react';
import './Operations.css';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { operationsApi } from '@/api/internal/operationsApi';
import { productsApi } from '@/api/internal/productsApi';
import ProductCreateForm from '../products/components/ProductCreateForm';

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
        <div className="operations-container animate-fade">
            <header className="operations-header">
                <h1>Warehouse Operations</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>New Operation</Button>
            </header>

            <div className="operations-grid">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Type</TableHeaderCell>
                            <TableHeaderCell>Date</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                            <TableHeaderCell>Description</TableHeaderCell>
                            <TableHeaderCell>Items Count</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {operations.map((op) => {
                            return (
                                <TableRow key={op.id}>
                                    <TableCell>
                                        {typeof op.type === 'number' ? ['PZ', 'WZ', 'RW', 'MM'][op.type] : op.type}
                                    </TableCell>
                                    <TableCell>{new Date(op.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`status-badge status-${(typeof op.status === 'number'
                                                ? ['pending', 'completed', 'cancelled'][op.status]
                                                : String(op.status).toLowerCase() || '')}`}
                                        >
                                            {typeof op.status === 'number' ? ['Pending', 'Completed', 'Cancelled'][op.status] : op.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{op.description}</TableCell>
                                    <TableCell>{op.items?.length || 0}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
                <div className="operation-modal-inner">
                    <h2>New Operation</h2>
                    <div className="form-grid">
                        <Select
                            label="Operation Type"
                            value={newOp.type}
                            onChange={e => setNewOp({ ...newOp, type: parseInt(e.target.value) })}
                            options={operationTypes}
                        />

                        <Input
                            label="Description"
                            type="text"
                            placeholder="Optional description..."
                            value={newOp.description}
                            onChange={e => setNewOp({ ...newOp, description: e.target.value })}
                        />
                    </div>

                    <div className="items-section">
                        <h3>Items</h3>
                        {newOp.items.map((item, idx) => (
                            <div key={idx} className="item-row">
                                <Select
                                    value={item.productId}
                                    onChange={e => {
                                        const items = [...newOp.items];
                                        items[idx].productId = e.target.value;
                                        setNewOp({ ...newOp, items });
                                    }}
                                    options={[
                                        { value: '', label: 'Select Product' },
                                        ...products.data.map(p => ({ value: p.id, label: p.name || p.deliveredAt }))
                                    ]}
                                />
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={e => {
                                        const items = [...newOp.items];
                                        items[idx].quantity = parseFloat(e.target.value);
                                        setNewOp({ ...newOp, items });
                                    }}
                                />
                            </div>
                        ))}
                        <div className="items-actions">
                            <Button variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
                            <Button
                                className="quick-add-btn"
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => setShowProductModal(true)}
                            >
                                Add new product
                            </Button>
                        </div>
                        <ProductCreateForm
                            isOpen={showProductModal}
                            onClose={() => setShowProductModal(false)}
                            onSuccess={() => {
                                queryClient.invalidateQueries({ queryKey: ['products'] });
                            }}
                        />
                    </div>

                    <div className="modal-actions">
                        <Button variant="danger" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleCreate} isLoading={isCreating}>Create Operation</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
