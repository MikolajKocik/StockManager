import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/common';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inventoryApi } from '@/api/internal/inventoryApi';
import type { InventoryItemCollection } from '@/models/inventoryItem';

export default function Home() {
    const { data: responseitems = { data: [] } } = useQuery<InventoryItemCollection>({
        queryKey: ['locations'],
        queryFn: inventoryApi.getItems
    });
    const items = responseitems?.data || [];

    const LIMIT = 500;

    return (
        <div className='h-full grid grid-cols-6 grid-rows-[auto_1.4fr_1fr_1.2fr] gap-4'>
            <div className="col-span-6">
                <div className="flex flex-row-reverse gap-4">
                    <button className="bg-[#CC6557] dash-button">Report Incident</button>
                    <button className="bg-amber-300 dash-button">Customize View</button>
                    <button className="bg-[#9BB477] dash-button">Generate Report</button>
                    <button className="bg-[#77A4B4] dash-button">Refresh</button>
                </div>
            </div>

            <div className="col-span-2 flex flex-col card">
                <h2 className="flex-row card-header">Location bin availability</h2>
                <div className="flex-row">
                    <Table className="w-full border-collapse">
                        <TableHead className="bg-slate-200">
                            <TableRow>
                                <TableHeaderCell>
                                    Name
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Type
                                </TableHeaderCell>
                                <TableHeaderCell>
                                    Bin usage in [%]
                                </TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const usagePercent = Math.min(100, Math.round((item.quantityOnHand / LIMIT) * 100));

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.binLocationCode}
                                        </TableCell>
                                        <TableCell className="bg-[#E3E3E3]">
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
