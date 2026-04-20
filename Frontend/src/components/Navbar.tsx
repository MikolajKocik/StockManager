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
                <span className="logo-icon">📦</span>
                StockManager
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        Dashboard
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
            </ul>

            <div className="navbar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}
