import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './Navbar.css';
import { Button } from '../common/Button';

export default function Navbar() {
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

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
                <div className="settings-container">
                    <Button
                        className={`settings-trigger ${showSettingsMenu ? 'active' : ''}`}
                        onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    >
                        <span className="icon">⚙️</span>
                        <span>Settings</span>
                    </Button>

                    {showSettingsMenu && (
                        <div className="settings-dropdown">
                            <div className="dropdown-header">System Settings</div>
                            <Button onClick={() => navigate('/settings/appearance')}>
                                Appearance
                            </Button>
                            <Button onClick={() => navigate('/settings/api')}>
                                API Keys
                            </Button>
                            <div className="dropdown-divider"></div>
                            <Button className="logout-btn-dropdown" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
