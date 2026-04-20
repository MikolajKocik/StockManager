import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{ textAlign: 'left', padding: '40px' }}>
            <h1>Welcome to StockManager</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '32px' }}>
                Manage your inventory, suppliers, and products with ease and efficiency.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    boxShadow: 'var(--shadow)'
                }}>
                    <h2 style={{ color: 'var(--accent)' }}>Products</h2>
                    <p>Total products in stock: 124</p>
                    <Link to="/products" style={{
                        display: 'inline-block',
                        marginTop: '16px',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        View all products →
                    </Link>
                </div>

                <div style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    boxShadow: 'var(--shadow)'
                }}>
                    <h2 style={{ color: 'var(--accent)' }}>Suppliers</h2>
                    <p>Active suppliers: 12</p>
                    <Link to="/suppliers" style={{
                        display: 'inline-block',
                        marginTop: '16px',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Manage suppliers →
                    </Link>
                </div>
            </div>
        </div>
    );
}
