import type { ReactNode, HTMLAttributes, DragEvent } from "react";
import filterIcon from '@/assets/filter-full.svg';
import filterNoneIcon from '@/assets/no-filter.svg';

interface TableElementProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    className?: string;
    isFiltered?: boolean;
    colSpan?: number;
    draggable?: boolean;
    onDragStart?: (e: DragEvent) => void;
    onDragOver?: (e: DragEvent) => void;
    onDragEnd?: (e: DragEvent) => void;
}

export function Table({ children, className = '', ...rest }: TableElementProps) {
    return (
        <div className="w-full overflow-x-auto rounded-md border border-slate-300 shadow-2xs bg-white" {...rest}>
            <table className={`w-full text-xs text-left border-collapse ${className}`}>
                {children}
            </table>
        </div>
    );
}

export function TableHead({ children, className = '', ...rest }: TableElementProps) {
    return (
        <thead className={`bg-[#2b6675] text-white font-bold uppercase text-[0.6875rem] tracking-wider border-b border-slate-700 ${className}`} {...rest}>
            {children}
        </thead>
    );
}

export function TableBody({ children, className = '', ...rest }: TableElementProps) {
    return (
        <tbody className={`divide-y divide-slate-200 bg-white ${className}`} {...rest}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = '', ...rest }: TableElementProps) {
    return (
        <tr
            {...rest}
            className={`transition-colors odd:bg-white even:bg-slate-50/70 hover:bg-slate-100/80 ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableHeaderCell({ children, className = '', isFiltered, colSpan, ...rest }: TableElementProps) {
    return (
        <th
            colSpan={colSpan}
            className={`bg-[#2b6675] text-white py-2.5 px-3 font-bold uppercase text-[0.6875rem] tracking-wider select-none border-b border-slate-700 ${className}`}
            {...rest}
        >
            <div className="inline-flex items-center gap-1.5 text-white">
                <span className="text-white font-bold">{children}</span>
                {isFiltered !== undefined && (
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-1 rounded bg-slate-700/60 hover:bg-slate-600 transition-colors cursor-pointer"
                        onClick={rest.onClick as any}
                        title="Sort / Filter"
                    >
                        <img
                            src={isFiltered ? filterIcon : filterNoneIcon}
                            alt="filter"
                            className="w-3.5 h-3.5 invert opacity-95 hover:opacity-100"
                        />
                    </button>
                )}
            </div>
        </th>
    );
}

export type TableCellVariant = 'default' | 'strong' | 'muted' | 'code' | 'highlight';

export interface TableCellProps extends TableElementProps {
    variant?: TableCellVariant;
}

export function TableCell({ children, className = '', colSpan, variant = 'default', ...rest }: TableCellProps) {
    const variantClasses: Record<TableCellVariant, string> = {
        default: 'text-slate-800',
        strong: 'font-semibold text-slate-900',
        muted: 'text-slate-500 text-xs',
        code: 'font-mono text-slate-800 text-xs',
        highlight: 'font-mono font-bold text-slate-900'
    };

    return (
        <td colSpan={colSpan} className={`py-2 px-3 align-middle ${variantClasses[variant]} ${className}`} {...rest}>
            {children}
        </td>
    );
}
