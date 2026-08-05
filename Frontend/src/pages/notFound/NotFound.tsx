import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from '@/components/common';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-100 p-6">
            <Card className="max-w-md w-full text-center">
                <CardBody className="p-8 space-y-4">
                    <span className="font-mono text-3xl font-bold text-slate-800">404</span>
                    <h2 className="text-sm font-semibold text-slate-700">Page Not Found</h2>
                    <p className="text-xs text-slate-500">
                        The requested warehouse resource or view does not exist in the routing table.
                    </p>
                    <div className="pt-2">
                        <Link to="/">
                            <Button variant="primary" size="md">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
