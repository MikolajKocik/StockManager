import { Button, Modal, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inventoryApi } from '@/api/internal/inventoryApi';
import type { InventoryItemCollection } from '@/models/inventoryItem';

export default function Home() {
    const { data: responseitems = { data: [] }, refetch } = useQuery<InventoryItemCollection>({
        queryKey: ['locations'],
        queryFn: inventoryApi.getItems
    });

    const [activeSort, setActiveSort] = useState<'name' | 'type' | 'usage' | null>(null);
    const [isOpenCustomize, setOpenCustomize] = useState(false);
    const [isOpenReport, setOpenReport] = useState(false);
    const [isOpenIncident, setOpenIncident] = useState(false);

    const toggleFilter = (key: 'name' | 'type' | 'usage') => {
        setActiveSort(prev => prev === key ? null : key);
    };

    const LIMIT = 500;

    const items = responseitems?.data || [];

    const displayedItems = [...items].sort((a, b) => {
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

            <div className="col-span-2 flex flex-col card">
                <h2 className="flex-row card-header">Location bin availability</h2>
                <div className="flex-row">
                    <Table className="w-full border-collapse mb-2">
                        <TableHead className="bg-slate-200">
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
                                    <TableRow key={item.id} className="text-center">
                                        <TableCell>
                                            {item.binLocationCode}
                                        </TableCell>
                                        <TableCell>
                                            {item.warehouse}
                                        </TableCell>
                                        <TableCell>
                                            {usagePercent}%
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="col-span-2 flex flex-col card">
            </div>

            <div className="col-span-2 flex flex-col card">
            </div>

            <div className="col-span-2 flex flex-col card">
            </div>

            <div className="col-span-2 flex flex-col card">
            </div>

            <div className="col-span-2 flex flex-col card">
            </div>

            <div className="col-span-3 flex flex-col card">
            </div>

            <div className="col-span-3 flex flex-col card">
            </div>
        </div>
    );
}
