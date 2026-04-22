import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Supplier } from '@/models/supplier';
import api from '@/api/api';
import type { Product } from '@/models/product';
import type { InventoryItemCollection } from '@/models/inventoryItem';
import type { ShipmentCollection } from '@/models/shipment';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { warehouseApi } from '@/api/warehouseApi';

export default function Home() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItemCollection>({ data: [] });
    const [shipments, setShipments] = useState<ShipmentCollection>({ data: [] });
    const [operations, setOperations] = useState<WarehouseOperation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [
                    suppliersRes, productsRes, invItemsRes,
                    shipmentsRes, operationsRes
                ] = await Promise.all([
                    api.get("/suppliers"),
                    api.get("/products"),
                    api.get("/inventory-items"),
                    api.get("shipments?status=Shipped"),
                    warehouseApi.getOperations()
                ]);
                setSuppliers(suppliersRes.data);
                setProducts(productsRes.data);
                setInventoryItems(invItemsRes.data);
                setShipments(shipmentsRes.data);
                setOperations(operationsRes.data)
            } catch (err) {
                console.error(`Error occurred while loading data: ${err}`);
                setError("Error occurred while loading data")
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // operations of last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOperationsCount = operations.filter(op =>
        new Date(op.date) >= sevenDaysAgo
    ).length ?? 0;

    return (
        <>
            {loading ? (
                <p>Loading ...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div className="animate-slide-up">
                    <header style={{ marginBottom: '48px' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Warehouse Management System</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                            Manage your inventory, suppliers, and products with ease and efficiency.
                        </p>
                    </header>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        <div className="card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                <img src="~/src/assets/package-svgrepo-com.svg" />
                            </div>
                            <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Products</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Total products in stock: <strong>{products.length ?? 0}</strong>
                            </p>
                            <Link to="/products" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                View all products <span style={{ marginLeft: '8px' }}>→</span>
                            </Link>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                <img src="~/src/assets/suppliers.svg" />
                            </div>
                            <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Suppliers</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Active suppliers: <strong>{suppliers.length ?? 0}</strong>
                            </p>
                            <Link to="/suppliers" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                Manage suppliers <span style={{ marginLeft: '8px' }}>→</span>
                            </Link>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                <img src="~/src/assets/stock.svg" />
                            </div>
                            <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Stock</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Stock state: <strong>{inventoryItems.data.length ?? 0}</strong>
                            </p>
                            <Link to="/inventory-items" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                Manage stock <span style={{ marginLeft: '8px' }}>→</span>
                            </Link>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                <img src="~/src/assets/delivery-transport-svgrepo-com.svg" />
                            </div>
                            <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Shipments</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Active shipments: <strong>{shipments.data.length ?? 0}</strong>
                            </p>
                            <Link to="/shipments" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                Manage shipments <span style={{ marginLeft: '8px' }}>→</span>
                            </Link>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                                <img src="~src/assets/process.svg" />
                            </div>
                            <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Operations</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                                Last 7 days: <strong>{recentOperationsCount}</strong>
                            </p>
                            <Link to="/operations" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                color: 'var(--accent)',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                Manage operations <span style={{ marginLeft: '8px' }}>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}
