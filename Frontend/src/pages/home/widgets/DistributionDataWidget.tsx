import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow
} from '@/components/common';
import { formatValue } from '@/utils/format';
import { useDistributionStatistics } from '../hooks/useDistributionStatistics';

export function DistributionDataWidget() {
    const { statistics, activeSort, toggleSort } = useDistributionStatistics();

    return (
        <div className="col-span-2 card">
            <h2 className="card-header">Distribution data</h2>
            <div className="card-body">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell
                                isFiltered={activeSort === 'category'}
                                onClick={() => toggleSort('category')}
                            >
                                Category
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'count'}
                                onClick={() => toggleSort('count')}
                            >
                                Count
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statistics.map((stat, idx) => (
                            <TableRow key={idx}>
                                <TableCell variant="strong">
                                    {formatValue(stat.label)}
                                </TableCell>
                                <TableCell variant="code">
                                    {formatValue(stat.count)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
