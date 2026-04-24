import { useState, useEffect } from 'react';
import { warehouseApi } from '@/api/warehouseApi';
import api from '@/api/api';
import './Operations.css';

export default function Operations() {
    const [operations, setOperations] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newOp, setNewOp] = useState({
        type: 0, // PZ
        date: new Date().toISOString().split('T')[0],
        description: '',
        items: [{ productId: '', quantity: 1 }]
    });

    useEffect(() => {
        fetchData();
        fetchProducts();
    }, []);

    const fetchData = async () => {
        const response = await warehouseApi.getOperations();
        setOperations(response.data);
    };

    const fetchProducts = async () => {
        const response = await api.get('/Product');
        setProducts(response.data);
    };

    const handleCreate = async () => {
        try {
            await warehouseApi.createOperation({
                ...newOp,
                type: parseInt(newOp.type.toString()),
                items: newOp.items.map(i => ({ ...i, productId: parseInt(i.productId) }))
            });
            setShowModal(false);
            fetchData();
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
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Items Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {operations.map((op: any) => (
                            <tr key={op.id}>
                                <td className={`type-badge type-${op.type}`}>{['PZ', 'WZ', 'RW', 'MM'][op.type]}</td>
                                <td>{new Date(op.date).toLocaleDateString()}</td>
                                <td className={`status-badge status-${op.status}`}>{['Pending', 'Completed', 'Cancelled'][op.status]}</td>
                                <td>{op.description}</td>
                                <td>{op.items.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
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
                                    {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
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
                    </div>
                </div>
            )}
        </div>
    );
};
