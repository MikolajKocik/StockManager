import { useState, useEffect } from 'react';
import { warehouseApi } from '@/api/warehouseApi';
import api from '@/api/api';
import './Operations.css';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';

export default function Operations() {
    const [operations, setOperations] = useState<WarehouseOperation[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newOp, setNewOp] = useState({
        type: 0, // PZ
        date: new Date().toISOString().split('T')[0],
        description: '',
        items: [{ productId: '', quantity: 1 }]
    });

    useEffect(() => {
        const fetchData = async () => {
            const [operationsRes, productsRes] = await Promise.all([
                warehouseApi.getOperations(),
                api.get('/products')
            ]);
            setOperations(operationsRes.data);
            setProducts(productsRes.data.data || productsRes.data);
        };

        fetchData();
    }, [newOp]);

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            await warehouseApi.createOperation({
                ...newOp,
                type: parseInt(newOp.type.toString()),
                items: newOp.items.map(i => ({ ...i, productId: parseInt(i.productId) }))
            } as WarehouseOperation);
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("Error creating operation");
        } finally {
            setIsCreating(false);
        }
    };

    const addItem = () => setNewOp({ ...newOp, items: [...newOp.items, { productId: '', quantity: 1 }] });

    const operationTypes = [
        { value: 0, label: 'PZ (Goods Receipt)' },
        { value: 1, label: 'WZ (Goods Issue)' },
        { value: 2, label: 'RW (Internal Consumption)' },
        { value: 3, label: 'MM (Stock Transfer)' }
    ];

    return (
        <div className="operations-container">
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="modal-content">
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
                                        ...products.map(p => ({ value: p.id, label: p.name || p.date }))
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
                        <Button variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
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
