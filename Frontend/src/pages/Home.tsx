import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="animate-slide-up">
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Dashboard</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                    Manage your inventory, suppliers, and products with ease and efficiency.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Products</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                        Total products in stock: <strong>124</strong>
                    </p>
                    <Link to="/products" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                    }}>
                        View all products <span style={{ marginLeft: '8px' }}>→</span>
                    </Link>
                </div>

                <div className="card">
                    <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🤝</div>
                    <h2 style={{ color: 'var(--accent)', marginBottom: '12px' }}>Suppliers</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
                        Active suppliers: <strong>12</strong>
                    </p>
                    <Link to="/suppliers" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: 'var(--accent)',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                    }}>
                        Manage suppliers <span style={{ marginLeft: '8px' }}>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
