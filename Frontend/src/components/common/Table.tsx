import type { ReactNode } from "react"
import './Table.css'

export function Table({ children }: { children: ReactNode}) {
    return <table className="template-table">{children}</table>
}

export function TableHead({ children }: { children: ReactNode }) {
    return <thead>{children}</thead>
}

export function TableBody({ children }: { children: ReactNode }) {
    return <tbody>{children}</tbody>
}

export function TableRow({ children }: { children: ReactNode }) {
    return <tr>{children}</tr>
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
    return <th>{children}</th>
}

export function TableCell({ children }: { children: ReactNode }) {
    return <td>{children}</td>
}