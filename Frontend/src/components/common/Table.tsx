import type { ReactNode } from "react";
import filterIcon from '@/assets/filter-full.svg';
import filterNoneIcon from '@/assets/no-filter.svg';

interface TableElementProps {
    children?: ReactNode;
    className?: string;
    isFiltered?: boolean;
    colSpan?: number;
    onClick?: () => void;
}

export function Table({ children, className = '' }: TableElementProps) {
    return (
        <div className="w-full overflow-x-auto rounded-md border border-slate-300 shadow-2xs bg-white">
            <table className={`w-full text-xs text-left border-collapse ${className}`}>
                {children}
            </table>
        </div>
    );
}

export function TableHead({ children, className = '' }: TableElementProps) {
    return (
        <thead className={`bg-slate-800 text-white font-bold uppercase text-[11px] tracking-wider border-b border-slate-700 ${className}`}>
            {children}
        </thead>
    );
}

export function TableBody({ children, className = '' }: TableElementProps) {
    return (
        <tbody className={`divide-y divide-slate-200 bg-white ${className}`}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = '', onClick }: TableElementProps) {
    return (
        <tr 
            onClick={onClick}
            className={`transition-colors odd:bg-white even:bg-slate-50/70 hover:bg-slate-100/80 ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableHeaderCell({ children, className = '', isFiltered, colSpan, onClick }: TableElementProps) {
    return (
        <th 
            colSpan={colSpan}
            className={`bg-slate-800 text-white py-2.5 px-3 font-bold uppercase text-[11px] tracking-wider select-none border-b border-slate-700 ${className}`}
        >
            <div className="inline-flex items-center gap-1.5 text-white">
                <span className="text-white font-bold">{children}</span>
                {isFiltered !== undefined && (
                    <button 
                        type="button"
                        className="inline-flex items-center justify-center p-1 rounded bg-slate-700/60 hover:bg-slate-600 transition-colors cursor-pointer" 
                        onClick={onClick}
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

export function TableCell({ children, className = '', colSpan }: TableElementProps) {
    return (
        <td colSpan={colSpan} className={`py-2 px-3 text-slate-800 align-middle ${className}`}>
            {children}
        </td>
    );
}
