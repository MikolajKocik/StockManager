import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import shipmentIcon from '@/assets/delivery-truck-speed-outline.svg';
import operationIcon from '@/assets/operation.svg';
import docIcon from '@/assets/document-search-outline-rounded.svg';
import stockIcon from '@/assets/backup-table-sharp.svg';
import barCodeIcon from '@/assets/barcode-scanner.svg';
import processIcon from '@/assets/browse-activity-outline-sharp.svg';
import suppliersIcon from '@/assets/suppliers-person.svg';
import arrowIcon from '@/assets/arrow-right.svg';
import productsIcon from '@/assets/warehouse-outline.svg';
import technicalIcon from '@/assets/forklift.svg';
import analyzeIcon from '@/assets/network-intelligence.svg';
import binMap from '@/assets/zoom-out-map.svg';
import mngIcon from '@/assets/engineering.svg';
import customerIcon from '@/assets/person.svg';
import returnIcon from '@/assets/keyboard-return.svg';
import rulesIcon from '@/assets/edit-notifications-outline.svg';
import auditIcon from '@/assets/event-list-outline-rounded.svg';
import invoiceIcon from '@/assets/invoices.svg';

export default function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <nav className={`relative flex flex-col pr-4 bg-[#84a7ad] border-r-[0.1rem] border-r-[#3b3c3d] transition-[width] duration-300 ease-in-out
            ${isCollapsed ? 'w-18' : 'w-54'}
        `}>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-1/3 -right-4.5 z-50 p-1 bg-[#84a7ad] border-[#3b3c3d] rounded border cursor-pointer hover:bg-[#B5B4B4]">
                <img src={arrowIcon} alt="Panel" />
            </button>

            <ul className="flex-col mt-2 overflow-hidden">
                <li className="nav-box flex-row">
                    <NavLink to="/" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={processIcon} className="nav-icon" alt="Dashboard" />
                        {!isCollapsed && <span>Dashboard</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/products" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={productsIcon} className="nav-icon" alt="Products" />
                        {!isCollapsed && <span>Products</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/suppliers" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={suppliersIcon} className="nav-icon" alt="Suppliers" />
                        {!isCollapsed && <span>Suppliers</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/operations" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={operationIcon} className="nav-icon" alt="Operations" />
                        {!isCollapsed && <span>Operations</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/shipments" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={shipmentIcon} className="nav-icon" alt="Shipments" />
                        {!isCollapsed && <span>Shipments</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/documents" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={docIcon} className="nav-icon" alt="Documents" />
                        {!isCollapsed && <span>Documents</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/stock" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={stockIcon} className="nav-icon" alt="Stock" />
                        {!isCollapsed && <span>Stock</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/barcodes" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={barCodeIcon} className="nav-icon" alt="BarCodes" />
                        {!isCollapsed && <span>BarCodes</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/maintenance" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={technicalIcon} className="nav-icon" alt="Maintenance" />
                        {!isCollapsed && <span>Maintenance</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/analyze" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={analyzeIcon} className="nav-icon" alt="Analyze" />
                        {!isCollapsed && <span>Analyze</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/bin-map" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={binMap} className="nav-icon" alt="Bin Map" />
                        {!isCollapsed && <span>Bin Map</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/manage" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={mngIcon} className="nav-icon" alt="Manage" />
                        {!isCollapsed && <span>Manage</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/reorder-rules" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={rulesIcon} className="nav-icon" alt="Reorder rules" />
                        {!isCollapsed && <span>Reorder rules</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/customers" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={customerIcon} className="nav-icon" alt="Customers" />
                        {!isCollapsed && <span>Customers</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/returns" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={returnIcon} className="nav-icon" alt="Returns" />
                        {!isCollapsed && <span>Returns</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/audit-log" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={auditIcon} className="nav-icon" alt="Audit Log" />
                        {!isCollapsed && <span>Audit Log</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/invoices" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={invoiceIcon} className="nav-icon" alt="Invoices" />
                        {!isCollapsed && <span>Invoices</span>}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
