import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                StockManager
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                        Analytics
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
                        Products
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/suppliers" className={({ isActive }) => isActive ? 'active' : ''}>
                        Suppliers
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/operations" className={({ isActive }) => isActive ? 'active' : ''}>
                        Operations
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/shipments" className={({ isActive }) => isActive ? 'active' : ''}>
                        Shipments
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
                        Documents
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/inventory-items" className={({ isActive }) => isActive ? 'active' : ''}>
                        Stock
                    </NavLink>
                </li>
            </ul>

            <div className="navbar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}
