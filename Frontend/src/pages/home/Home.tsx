import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inventoryApi } from '@/api/internal/inventoryApi';
import type { InventoryItemCollection } from '@/models/inventoryItem';
import type { DistributionData } from '@/models/statistics';
import { statisticsApi } from '@/api/internal/statisticsApi';

export default function Home() {
    const { data: items = { data: [] }, refetch } = useQuery<InventoryItemCollection>({
        queryKey: ['locations'],
        queryFn: inventoryApi.getItems
    });
    const responseitems = items?.data || [];

    const { data: statistics = [] } = useQuery<DistributionData[]>({
        queryKey: ['statistics'],
        queryFn: statisticsApi.getDistribution
    });

    const [activeSort, setActiveSort] = useState<'name' | 'type' | 'usage' | 'category' | 'count' | null>(null);
    const [isOpenCustomize, setOpenCustomize] = useState(false);
    const [isOpenReport, setOpenReport] = useState(false);
    const [isOpenIncident, setOpenIncident] = useState(false);

    const toggleFilter = (key: 'name' | 'type' | 'usage' | 'category' | 'count') => {
        setActiveSort(prev => prev === key ? null : key);
    };

    const LIMIT = 500;

    const displayedItems = [...responseitems].sort((a, b) => {
        if (activeSort === 'name') {
            return (a.binLocationCode || '').localeCompare(b.binLocationCode || '');
        }
        if (activeSort === 'type') {
            return (a.warehouse || '').localeCompare(b.warehouse || '');
        }
        if (activeSort === 'usage') {
            return a.quantityOnHand - b.quantityOnHand;
        }
        return 0;
    });

    const sortedStatistics = [...statistics].sort((a, b) => {
        if (activeSort === 'category') {
            return (a.label || '').localeCompare(b.label || '');
        }
        if (activeSort === 'count') {
            return a.count - b.count;
        }
        return 0;
    });

    return (
        <div className='h-full grid grid-cols-6 grid-rows-[auto_1.4fr_1fr_1.2fr] gap-4'>
            <div className="col-span-6">
                <div className="flex flex-row-reverse gap-4">
                    <Button className="bg-[#CC6557] dash-button" onClick={() => setOpenIncident(true)}>Report Incident</Button>
                    <Button className="bg-amber-300 dash-button" onClick={() => setOpenCustomize(true)}>Customize View</Button>
                    <Button className="bg-[#9BB477] dash-button" onClick={() => setOpenReport(true)}>Generate Report</Button>
                    <Button className="bg-[#77A4B4] dash-button" onClick={() => refetch()}>Refresh</Button>
                </div>

                <Modal
                    isOpen={isOpenIncident}
                    onClose={() => setOpenIncident(false)}
                >
                    <h3></h3>
                    <p></p>
                </Modal>


                <Modal
                    isOpen={isOpenCustomize}
                    onClose={() => setOpenCustomize(false)}
                >
                    <h3></h3>
                    <p></p>
                </Modal>


                <Modal
                    isOpen={isOpenReport}
                    onClose={() => setOpenReport(false)}
                >
                    <h3></h3>
                    <p></p>
                </Modal>
            </div>

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
                            {sortedStatistics.map((stat) => {

                                return (
                                    <TableRow key={stat.label} className="text-center bg-slate-300">
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

            <div className="col-span-2 card">
            </div>

            <div className="col-span-2 card">
            </div>

            <div className="col-span-4 card">
            </div>

            <div className="col-span-3 card">
            </div>

            <div className="col-span-3 card">
            </div>
        </div>
    );
}
