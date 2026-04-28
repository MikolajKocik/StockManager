import { useState, useEffect } from 'react';
import type { Supplier } from '@/models/supplier';
import api from '@/api/api';
import type { Product } from '@/models/product';
import type { InventoryItemCollection } from '@/models/inventoryItem';
import type { ShipmentCollection } from '@/models/shipment';
import type { WarehouseOperation } from '@/models/warehouseOperation';
import { warehouseApi } from '@/api/warehouseApi';
import DashboardCard from './components/DashboardCard';
import './Home.css';

// Import icons
import packageIcon from '@/assets/package-svgrepo-com.svg';
import suppliersIcon from '@/assets/suppliers.svg';
import stockIcon from '@/assets/stock.svg';
import deliveryIcon from '@/assets/delivery-transport-svgrepo-com.svg';
import processIcon from '@/assets/process.svg';

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
                    api.get("/shipments?status=Shipped"),
                    warehouseApi.getOperations()
                ]);
                setSuppliers(suppliersRes.data);
                setProducts(productsRes.data.data || []);
                setInventoryItems(invItemsRes.data);
                setShipments(shipmentsRes.data);
                setOperations(operationsRes.data)
            } catch (err) {
                console.error(`Error occurred while loading data: ${err}`);
                setError("Error occurred while fetching data. Try again later.")
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
                <p className="error-message">{error}</p>
            ) : (
                <div className="animate-slide-up">
                    <header className="home-header">
                        <h1 className="home-title">Warehouse Management System</h1>
                        <p className="home-subtitle">
                            Manage your inventory, suppliers, and products with ease and efficiency.
                        </p>
                    </header>

                    <div className="dashboard-grid">
                        <DashboardCard
                            icon={packageIcon}
                            title="Products"
                            subtitle="Total products in stock"
                            count={products.length ?? 0}
                            linkTo="/products"
                            linkText="View all products"
                        />

                        <DashboardCard
                            icon={suppliersIcon}
                            title="Suppliers"
                            subtitle="Active suppliers"
                            count={suppliers.length ?? 0}
                            linkTo="/suppliers"
                            linkText="Manage suppliers"
                        />

                        <DashboardCard
                            icon={stockIcon}
                            title="Stock"
                            subtitle="Stock state"
                            count={inventoryItems.data.length ?? 0}
                            linkTo="/inventory-items"
                            linkText="Manage stock"
                        />

                        <DashboardCard
                            icon={deliveryIcon}
                            title="Shipments"
                            subtitle="Active shipments"
                            count={shipments.data.length ?? 0}
                            linkTo="/shipments"
                            linkText="Manage shipments"
                        />

                        <DashboardCard
                            icon={processIcon}
                            title="Operations"
                            subtitle="Last 7 days"
                            count={recentOperationsCount}
                            linkTo="/operations"
                            linkText="Manage operations"
                        />
                    </div>
                </div>
            )
            }
        </>
    );
}
