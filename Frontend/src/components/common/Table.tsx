import type { ReactNode } from "react"
import { Button } from "./Button";
import filterIcon from '@/assets/filter-full.svg';
import filterNoneIcon from '@/assets/no-filter.svg';

interface TableElementProps {
    children: ReactNode;
    className?: string;
    isFiltered?: boolean;
    onClick?: () => void;
}

export function Table({ children, className }: TableElementProps) {
    return <table className={className}>{children}</table>
}

export function TableHead({ children, className }: TableElementProps) {
    return <thead className={className}>{children}</thead>
}

export function TableBody({ children, className }: TableElementProps) {
    return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className }: TableElementProps) {
    return <tr className={className}>{children}</tr>
}

export function TableHeaderCell({ children, className, isFiltered, onClick }: TableElementProps) {
    return <th className={className}>
        {children}
        {isFiltered !== undefined && (
            <Button className="h-4 pl-1 cursor-pointer" onClick={onClick}>
                {isFiltered
                    ? <img src={filterIcon} alt="filter icon" />
                    : <img src={filterNoneIcon} alt="filter none icon" />
                }
            </Button>
        )}
    </th>
}

export function TableCell({ children, className }: TableElementProps) {
    return <td className={className}>{children}</td>
}
