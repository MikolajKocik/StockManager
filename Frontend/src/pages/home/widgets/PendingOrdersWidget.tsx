import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow
} from '@/components/common';
import { formatCurrency, formatDate, formatValue } from '@/utils/format';
import { usePendingOrders } from '../hooks/usePendingOrders';
import { ORDER_TYPE_VARIANTS } from '../constants';

export function PendingOrdersWidget() {
    const { items, activeSort, toggleSort } = usePendingOrders();

    return (
        <section className="col-span-4 card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                <h2 className="card-header border-none p-0 m-0">Pending Orders</h2>

                <div
                    role="region"
                    aria-label="Pending orders legend"
                    className="flex items-center gap-1.5 text-xs text-slate-600 font-medium"
                >
                    <span className="text-slate-400 text-[0.6875rem] mr-1" aria-hidden="true">
                        Rejestr:
                    </span>
                    <div className="flex items-center gap-1">
                        <Badge variant="blue" title="Przyjęcie Zewnętrzne (Inbound Delivery)">
                            PZ
                        </Badge>
                        <span className="text-slate-500 text-[0.6875rem] mr-1.5">Inbound</span>
                        <Badge variant="purple" title="Wydanie Zewnętrzne (Outbound Dispatch)">
                            WZ
                        </Badge>
                        <span className="text-slate-500 text-[0.6875rem] mr-1.5">Outbound</span>
                        <Badge
                            variant="amber"
                            title="Przesunięcie Międzymagazynowe (Internal Transfer)"
                        >
                            MM
                        </Badge>
                        <span className="text-slate-500 text-[0.6875rem]">Transfer</span>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell
                                isFiltered={activeSort === 'product'}
                                onClick={() => toggleSort('product')}
                            >
                                Product
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'unit'}
                                onClick={() => toggleSort('unit')}
                            >
                                Unit
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'quantity'}
                                onClick={() => toggleSort('quantity')}
                            >
                                Quantity
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'price'}
                                onClick={() => toggleSort('price')}
                            >
                                Price
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'sum'}
                                onClick={() => toggleSort('sum')}
                            >
                                Sum
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'orderType'}
                                onClick={() => toggleSort('orderType')}
                            >
                                Type
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'client'}
                                onClick={() => toggleSort('client')}
                            >
                                Client
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'NIP'}
                                onClick={() => toggleSort('NIP')}
                            >
                                NIP
                            </TableHeaderCell>
                            <TableHeaderCell
                                isFiltered={activeSort === 'date'}
                                onClick={() => toggleSort('date')}
                            >
                                Date
                            </TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell variant="strong">{item.product}</TableCell>
                                <TableCell variant="code">
                                    {formatValue(item.unit)}
                                </TableCell>
                                <TableCell variant="code">{formatValue(item.quantity)}</TableCell>
                                <TableCell variant="code">{formatCurrency(item.price)}</TableCell>
                                <TableCell variant="highlight">{formatCurrency(item.sum)}</TableCell>
                                <TableCell>
                                    <Badge variant={ORDER_TYPE_VARIANTS[item.type] ?? 'slate'}>
                                        {formatValue(item.type)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatValue(item.client)}</TableCell>
                                <TableCell variant="muted">{formatValue(item.nip)}</TableCell>
                                <TableCell variant="muted">
                                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
