import {
    Meter,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow
} from '@/components/common';
import { formatValue } from '@/utils/format';
import { useLocationBins } from '../hooks/useLocationBins';
import { BIN_CAPACITY_LIMIT } from '../constants';

export function LocationBinWidget() {
    const { items, activeSort, toggleSort } = useLocationBins();

    return (
        <div className="col-span-2 card">
            <h2 className="card-header">Location bin availability</h2>
            <div className="card-body">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell
                                isFiltered={activeSort === 'name'}
                                onClick={() => toggleSort('name')}
                            >
                                Name
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'type'}
                                onClick={() => toggleSort('type')}
                            >
                                Type
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'usage'}
                                onClick={() => toggleSort('usage')}
                            >
                                Bin Usage
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            const usagePercent = Math.min(
                                100,
                                Math.round((item.quantityOnHand / BIN_CAPACITY_LIMIT) * 100)
                            );
                            const isCritical = usagePercent >= 90;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell variant="highlight">
                                        {formatValue(item.binLocationCode)}
                                    </TableCell>
                                    <TableCell>
                                        {formatValue(item.warehouse)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Meter
                                                value={usagePercent}
                                                min={0}
                                                max={100}
                                                low={50}
                                                high={90}
                                                optimum={20}
                                            />
                                            <span className={`font-mono text-xs font-semibold w-10 text-right ${
                                                isCritical ? 'text-[#991b1b] font-bold' : 'text-slate-700'
                                            }`}>
                                                {formatValue(usagePercent)}%
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
    );
}
