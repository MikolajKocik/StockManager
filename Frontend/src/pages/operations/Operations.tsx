import { useState, useEffect } from 'react';
import { warehouseApi } from '@/api/warehouseApi';
import api from '@/api/api';
import './Operations.css';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@/components/common/Table';
import Modal from '@/components/common/Modal';

export default function Operations() {
    const [operations, setOperations] = useState<WarehouseOperation[]>([]);
    const [products, setProducts] = useState<WarehouseOperation[]>([]);
    const [showModal, setShowModal] = useState(false);
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
            setProducts(productsRes.data);
        };

        fetchData();
    }, [newOp]);

    const handleCreate = async () => {
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
        }
    };

    const addItem = () => setNewOp({ ...newOp, items: [...newOp.items, { productId: '', quantity: 1 }] });

    return (
        <div className="operations-container">
            <header className="operations-header">
                <h1>Warehouse Operations</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>New Operation</button>
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
                                        {typeof op.status === 'number' ? ['Pending', 'Completed', 'Cancelled'][op.status] : op.status}
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
                <h2>New Operation</h2>
                <div className="form-group">
                    <label>Type</label>
                    <select value={newOp.type} onChange={e => setNewOp({ ...newOp, type: parseInt(e.target.value) })}>
                        <option value={0}>PZ (Goods Receipt)</option>
                        <option value={1}>WZ (Goods Issue)</option>
                        <option value={2}>RW (Internal Consumption)</option>
                        <option value={3}>MM (Stock Transfer)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input type="text" value={newOp.description} onChange={e => setNewOp({ ...newOp, description: e.target.value })} />
                </div>
                <h3>Items</h3>
                {newOp.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                        <select value={item.productId} onChange={e => {
                            const items = [...newOp.items];
                            items[idx].productId = e.target.value;
                            setNewOp({ ...newOp, items });
                        }}>
                            <option value="">Select Product</option>
                            {products.map((p) =>
                                <option key={p.id} value={p.id}>{p.date}</option>)}
                        </select>
                        <input type="number" value={item.quantity} onChange={e => {
                            const items = [...newOp.items];
                            items[idx].quantity = parseFloat(e.target.value);
                            setNewOp({ ...newOp, items });
                        }} />
                    </div>
                ))}
                <button className="btn-secondary" onClick={addItem}>Add Item</button>
                <div className="modal-actions">
                    <button className="btn-primary" onClick={handleCreate}>Create</button>
                    <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};
