import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import ReportIncidentForm from './components/ReportIncidentForm';
import CustomizeViewForm, { type DashboardWidgets } from './components/CustomizeViewForm';
import GenerateReportForm from './components/GenerateReportForm';
import { genericSort } from '@/utils/sort';
import { useInventoryItems } from '@/pages/inventoryItems/hooks/useInventoryItems';
import { useDistributionData } from '@/hooks/queries/useStatistics';
import { useSalesOrders } from '@/hooks/queries/useSalesOrders';
import { usePurchaseOrders } from '@/hooks/queries/usePurchaseOrders';
import { useMaintenanceIncidents } from '@/pages/maintenance/hooks/useMaintenanceIncidents';

type Sorted = 'name' | 'type' | 'usage' | 'category' | 'count' |
    'product' | 'unit' | 'quantity' | 'price' | 'sum' | 'orderType' |
    'client' | 'NIP' | 'date';
const LIMIT = 500;

export default function Home() {
    const { data: items = { data: [] }, refetch: refetchItems, isFetching: isFetchingItems } = useInventoryItems();
    const { data: statistics = [], refetch: refetchStatistics, isFetching: isFetchingStatistics } = useDistributionData();
    const { data: salesOrders = [], refetch: refetchSalesOrders, isFetching: isFetchingSalesOrders } = useSalesOrders();
    const { data: purchaseOrders = [], refetch: refetchPurchaseOrders, isFetching: isFetchingPurchaseOrders } = usePurchaseOrders();
    const { data: incidents = [], refetch: refetchIncidents, isFetching: isFetchingIncidents } = useMaintenanceIncidents();

    const isFetchingAny = isFetchingItems || isFetchingStatistics ||
        isFetchingSalesOrders || isFetchingPurchaseOrders || isFetchingIncidents;

    const [activeSort, setActiveSort] = useState<Sorted | null>(null);
    const [isOpenCustomize, setOpenCustomize] = useState(false);
    const [isOpenReport, setOpenReport] = useState(false);
    const [isOpenIncident, setOpenIncident] = useState(false);

    const [widgets, setWidgets] = useState<DashboardWidgets>({
        locationBin: true,
        distributionData: true,
        maintenanceTasks: true,
        pendingOrders: true,
        liveActivityFeed: true
    });

    const toggleWidget = (key: keyof DashboardWidgets) => {
        setWidgets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const responseitems = items?.data || [];

    const toggleFilter = (key: Sorted) => {
        setActiveSort(prev => prev === key ? null : key);
    };

    const handleRefresh = () => {
        const refreshPromise = Promise.all([
            refetchItems(),
            refetchIncidents(),
            refetchPurchaseOrders(),
            refetchSalesOrders(),
            refetchStatistics(),
        ]);

        toast.promise(
            refreshPromise,
            {
                loading: 'Refreshing...',
                success: <b>Refreshed!</b>,
                error: <b>Failed to refresh</b>
            },
            { id: 'refetch-toast' }
        );
    };

    const displayedItems = genericSort(responseitems, activeSort, {
        name: 'binLocationCode',
        type: 'warehouse',
        usage: 'quantityOnHand'
    });

    const sortedStatistics = genericSort(statistics, activeSort, {
        category: 'label',
        count: 'count'
    });

    const pendingItems = [
        ...salesOrders.flatMap(order => order.salesOrderLines.map(line => ({
            product: line.productName,
            unit: line.uoM,
            quantity: line.quantity,
            price: line.unitPrice,
            sum: line.lineTotal,
            type: 'WZ',
            client: order.customerName,
            nip: order.customerTaxId || '-',
            date: order.orderDate
        }))),
        ...purchaseOrders.flatMap(order => order.purchaseOrderLines.map(line => ({
            product: line.productName,
            unit: line.uoM,
            quantity: line.quantity,
            price: line.unitPrice,
            sum: line.lineTotal,
            type: 'PZ',
            client: order.supplierName,
            nip: order.supplierTaxId || '-',
            date: order.orderDate
        })))
    ];

    const sortedPendingItems = genericSort(pendingItems, activeSort, {
        product: 'product',
        unit: 'unit',
        quantity: 'quantity',
        price: 'price',
        sum: 'sum',
        orderType: 'type',
        client: 'client',
        NIP: 'nip',
        date: 'date'
    });

    const activeIncidents = incidents.filter(
        incident => incident.status !== 'Resolved' &&
            incident.status !== 'Cancelled'
    );

    return (
        <div className='h-full grid grid-cols-6 grid-rows-[auto_1fr_1fr] gap-4'>
            <div className="col-span-6">
                <div className="flex flex-row-reverse gap-4">
                    <Button variant="danger" className="p-1" onClick={() => setOpenIncident(true)}>Report Incident</Button>
                    <Button variant="warning" className="p-1" onClick={() => setOpenCustomize(true)}>Customize View</Button>
                    <Button variant="success" className="p-1" onClick={() => setOpenReport(true)}>Generate Report</Button>
                    <Button variant="accent" className="p-1 m-[0.4rem]" onClick={handleRefresh} disabled={isFetchingAny}>Refresh</Button>
                </div>

                <Modal
                    isOpen={isOpenIncident}
                    onClose={() => setOpenIncident(false)}
                >
                    <ReportIncidentForm onClose={() => setOpenIncident(false)} />
                </Modal>


                <Modal
                    isOpen={isOpenCustomize}
                    onClose={() => setOpenCustomize(false)}
                >
                    <CustomizeViewForm
                        widgets={widgets}
                        onChange={toggleWidget}
                        onClose={() => setOpenCustomize(false)}
                    />
                </Modal>


                <Modal
                    isOpen={isOpenReport}
                    onClose={() => setOpenReport(false)}
                >
                    <GenerateReportForm onClose={() => setOpenReport(false)} />
                </Modal>
            </div>

            {widgets.locationBin && (
                <div className="col-span-2 card">
                    <h2 className="card-header">Location bin availability</h2>
                    <div className="card-body">
                        <Table className="w-full h-full border-collapse mb-2 border">
                            <TableHead className="bg-slate-200 border">
                                <TableRow>
                                    <TableHeaderCell isFiltered={activeSort === 'name'} onClick={() => toggleFilter('name')}>
                                        Name
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'type'} onClick={() => toggleFilter('type')}>
                                        Type
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'usage'} onClick={() => toggleFilter('usage')}>
                                        Bin usage in <span className="text-blue-700">[%]</span>
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedItems.map((item) => {
                                    const usagePercent = Math.min(100, Math.round((item.quantityOnHand / LIMIT) * 100));

                                    return (
                                        <TableRow key={item.id} className="text-center bg-slate-300">
                                            <TableCell className="border">
                                                {item.binLocationCode}
                                            </TableCell>
                                            <TableCell className="border">
                                                {item.warehouse}
                                            </TableCell>
                                            <TableCell className={`border ${usagePercent >= 90 ? 'bg-[#CC6557]' : usagePercent >= 50 ? 'bg-amber-300' : 'bg-[#9BB477]'}`}>
                                                {usagePercent}%
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {widgets.distributionData && (
                <div className="col-span-2 card">
                    <h2 className="card-header">Distribution data</h2>
                    <div className="card-body">
                        <Table className="w-full h-full border-collapse mb-2 border">
                            <TableHead className="bg-slate-200 border">
                                <TableRow>
                                    <TableHeaderCell isFiltered={activeSort === 'category'} onClick={() => toggleFilter('category')}>
                                        Category
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'count'} onClick={() => toggleFilter('count')}>
                                        Count
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedStatistics.map((stat, idx) => {

                                    return (
                                        <TableRow key={idx} className="text-center bg-slate-300">
                                            <TableCell className="border">
                                                {stat.label}
                                            </TableCell>
                                            <TableCell className="border">
                                                {stat.count}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {widgets.maintenanceTasks && (
                <div className="col-span-2 card">
                    <h2 className="card-header">Maintenance Tasks</h2>
                    <div className="card-body">
                        <Table className="w-full h-full border-collapse mb-2 border">
                            <TableHead className="bg-slate-200 border">
                                <TableRow>
                                    <TableHeaderCell>Incident / Asset</TableHeaderCell>
                                    <TableHeaderCell>Location</TableHeaderCell>
                                    <TableHeaderCell>Priority</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeIncidents.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="text-center italic text-slate-500 py-4">
                                            No active incidents
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeIncidents.map((incident) => (
                                        <TableRow key={incident.id} className="text-center bg-slate-300">
                                            <TableCell className="border text-left pl-2">
                                                <div className="font-semibold">{incident.title}</div>
                                                <div className="text-xs text-slate-600">{incident.assetName || 'General'}</div>
                                            </TableCell>
                                            <TableCell className="border">{incident.binLocationCode || '-'}</TableCell>
                                            <TableCell className={`border font-semibold ${incident.priority === 'Critical' ? 'bg-[#CC6557]' :
                                                incident.priority === 'High' ? 'bg-amber-300' : 'bg-slate-200'
                                                }`}>
                                                {incident.priority}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {widgets.pendingOrders && (
                <div className="col-span-4 card">
                    <div className="flex items-center gap-2">
                        <h2 className="flex-row card-header pr-6">Pending Orders</h2>

                        <div className="bg-[#77A4B4] w-4 h-4" />
                        <span className="font-bold pr-4">PZ</span>

                        <div className="bg-[#8564C8] w-4 h-4" />
                        <span className="font-bold pr-4">WZ</span>

                        <div className="bg-[#CC8F49] w-4 h-4" />
                        <span className="font-bold pr-4">MM</span>

                        <div className="bg-[#3A8054] w-4 h-4" />
                        <span className="font-bold pr-4">kg</span>

                        <div className="bg-[#9C4A36] w-4 h-4" />
                        <span className="font-bold pr-4">pcs</span>

                        <div className="bg-[#8F49CC] w-4 h-4" />
                        <span className="font-bold pr-4">l</span>
                    </div>
                    <div className="card-body">
                        <Table className="w-full h-full border-collapse mb-2 border">
                            <TableHead className="bg-slate-200 border">
                                <TableRow>
                                    <TableHeaderCell isFiltered={activeSort === 'product'} onClick={() => toggleFilter('product')}>
                                        Product
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'unit'} onClick={() => toggleFilter('unit')}>
                                        Unit
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'quantity'} onClick={() => toggleFilter('quantity')}>
                                        Quantity
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'price'} onClick={() => toggleFilter('price')}>
                                        Price
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'sum'} onClick={() => toggleFilter('sum')}>
                                        Sum
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'orderType'} onClick={() => toggleFilter('orderType')}>
                                        Type
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'client'} onClick={() => toggleFilter('client')}>
                                        Client
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'NIP'} onClick={() => toggleFilter('NIP')}>
                                        NIP
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'date'} onClick={() => toggleFilter('date')}>
                                        Date
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedPendingItems.map((item, idx) => {
                                    return (
                                        <TableRow key={idx} className="text-center bg-slate-300">
                                            <TableCell className="border">{item.product}</TableCell>
                                            <TableCell className={`border ${item.unit === 'kg' ? 'bg-[#3A8054]' : item.unit === 'pcs' ? 'bg-[#9C4A36]' : 'bg-[#8F49CC]'}`}>{item.unit}</TableCell>
                                            <TableCell className="border">{item.quantity}</TableCell>
                                            <TableCell className="border">{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="border">{item.sum.toFixed(2)}</TableCell>
                                            <TableCell className={`border ${item.type === 'WZ' ? 'bg-[#8564C8]' : item.type === 'PZ' ? 'bg-[#77A4B4]' : 'bg-[#CC8F49]'}`}>{item.type}</TableCell>
                                            <TableCell className="border">{item.client || '-'}</TableCell>
                                            <TableCell className="border">{item.nip}</TableCell>
                                            <TableCell className="border">{new Date(item.date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {widgets.liveActivityFeed && (
                <div className="col-span-2 card">
                    <LiveActivityFeed />
                </div>
            )}
        </div>
    );
}
