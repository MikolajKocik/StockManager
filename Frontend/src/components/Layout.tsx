import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/products">Products</Link>
                <Link to="/suppliers">Suppliers</Link>
                <Link to="/products/create">+ Add Product</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    )
}