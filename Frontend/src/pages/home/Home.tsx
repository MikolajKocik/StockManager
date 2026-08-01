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
                <div className="flex flex-row-reverse items-center gap-2 mb-2">
                    <Button 
                        variant="danger" 
                        size="md"
                        onClick={() => setOpenIncident(true)}
                    >
                        Report Incident
                    </Button>
                    <Button 
                        variant="warning" 
                        size="md"
                        onClick={() => setOpenCustomize(true)}
                    >
                        Customize View
                    </Button>
                    <Button 
                        variant="success" 
                        size="md"
                        onClick={() => setOpenReport(true)}
                    >
                        Generate Report
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="md"
                        onClick={handleRefresh} 
                        disabled={isFetchingAny}
                    >
                        Refresh
                    </Button>
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
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell isFiltered={activeSort === 'name'} onClick={() => toggleFilter('name')}>
                                        Name
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'type'} onClick={() => toggleFilter('type')}>
                                        Type
                                    </TableHeaderCell>
                                    <TableHeaderCell isFiltered={activeSort === 'usage'} onClick={() => toggleFilter('usage')}>
                                        Bin Usage
                                    </TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedItems.map((item) => {
                                    const usagePercent = Math.min(100, Math.round((item.quantityOnHand / LIMIT) * 100));

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono font-bold text-slate-800">
                                                {item.binLocationCode}
                                            </TableCell>
                                            <TableCell className="text-slate-600 font-medium">
                                                {item.warehouse}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-300 ${
                                                                usagePercent >= 90 
                                                                    ? 'bg-rose-500' 
                                                                    : usagePercent >= 50 
                                                                        ? 'bg-amber-500' 
                                                                        : 'bg-emerald-500'
                                                            }`}
                                                            style={{ width: `${usagePercent}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${
                                                        usagePercent >= 90 
                                                            ? 'bg-rose-50 text-rose-800 border-rose-200' 
                                                            : usagePercent >= 50 
                                                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    }`}>
                                                        {usagePercent}%
                                                    </span>
                                                </div>
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
                        <Table>
                            <TableHead>
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
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium text-slate-800">
                                                {stat.label}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs">
                                                    {stat.count}
                                                </span>
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
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Incident / Asset</TableHeaderCell>
                                    <TableHeaderCell>Location</TableHeaderCell>
                                    <TableHeaderCell className="text-center">Priority</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeIncidents.length === 0 ? (
                                    <TableRow>
                                        <TableCell className="text-center italic text-slate-400 py-4" colSpan={3}>
                                            No active incidents
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeIncidents.map((incident) => (
                                        <TableRow key={incident.id}>
                                            <TableCell>
                                                <div className="font-semibold text-slate-900 leading-tight">{incident.title}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">{incident.assetName || 'General'}</div>
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-600 text-xs">
                                                {incident.binLocationCode || '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                    incident.priority === 'Critical' 
                                                        ? 'bg-rose-100 text-rose-800 border-rose-300' 
                                                        : incident.priority === 'High' 
                                                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                                                            : 'bg-slate-100 text-slate-700 border-slate-300'
                                                }`}>
                                                    {incident.priority}
                                                </span>
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
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                        <h2 className="card-header border-none p-0 m-0">Pending Orders</h2>

                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-400 text-[11px] mr-1">Legend:</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">PZ</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">WZ</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">MM</span>
                            <span className="text-slate-300 mx-0.5">|</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">kg</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">pcs</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">l</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <Table>
                            <TableHead>
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
                                        <TableRow key={idx}>
                                            <TableCell className="font-semibold text-slate-900">{item.product}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                                    item.unit === 'kg' 
                                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                                        : item.unit === 'pcs' 
                                                            ? 'bg-orange-100 text-orange-800 border-orange-200' 
                                                            : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                }`}>
                                                    {item.unit}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-800">{item.quantity}</TableCell>
                                            <TableCell className="font-mono text-slate-600">{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="font-mono font-bold text-slate-900">{item.sum.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                    item.type === 'WZ' 
                                                        ? 'bg-purple-100 text-purple-800 border-purple-200' 
                                                        : item.type === 'PZ' 
                                                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                                            : 'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                    {item.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-700 font-medium">{item.client || '-'}</TableCell>
                                            <TableCell className="font-mono text-slate-500 text-xs">{item.nip}</TableCell>
                                            <TableCell className="text-slate-600 text-xs">{new Date(item.date).toLocaleDateString()}</TableCell>
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
