import {
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow
} from '@/components/common';
import { formatValue } from '@/utils/format';
import { useMaintenanceTasks } from '../hooks/useMaintenanceTasks';
import { PRIORITY_VARIANTS } from '../constants';

export function MaintenanceTasksWidget() {
    const { activeIncidents } = useMaintenanceTasks();

    return (
        <div className="col-span-2 card">
            <h2 className="card-header">Maintenance Tasks</h2>
            <div className="card-body">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Incident / Asset</TableHeaderCell>
                            <TableHeaderCell>Location</TableHeaderCell>
                            <TableHeaderCell className="text-center">Priority</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activeIncidents.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    className="text-center italic text-slate-400 py-4"
                                    colSpan={3}
                                >
                                    No active incidents
                                </TableCell>
                            </TableRow>
                        ) : (
                            activeIncidents.map((incident) => (
                                <TableRow key={incident.id || '-'}>
                                    <TableCell>
                                        <div className="font-semibold text-slate-900 leading-tight">
                                            {formatValue(incident.title)}
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                            {formatValue(incident.assetName)}
                                        </div>
                                    </TableCell>
                                    <TableCell variant="code">
                                        {formatValue(incident.binLocationCode)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                PRIORITY_VARIANTS[incident.priority] ?? 'slate'
                                            }
                                        >
                                            {formatValue(incident.priority)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
