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

export default function Navbar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <nav className={`relative flex flex-col pr-4 bg-[#D9D9D9] border-r-[0.1rem] border-r-[#779ABC] transition-[width] duration-300 ease-in-out
            ${isCollapsed ? 'w-20' : 'w-54'}
        `}>

            <button
                onClick={(e) => setIsCollapsed(!isCollapsed)}
                className="absolute top-1/3 -right-4.5 z-50 p-1 bg-[#D9D9D9] text-[#779ABC] rounded border cursor-pointer hover:bg-[#B5B4B4]">
                <img src={arrowIcon} alt="Panel" />
            </button>

            <ul className="flex-col mt-2 overflow-hidden">
                <li className="nav-box flex-row">
                    <NavLink to="/" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={processIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Panel</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/products" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={productsIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Products</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/suppliers" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={suppliersIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Suppliers</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/operations" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={operationIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Operations</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/shipments" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={shipmentIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Shipments</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/documents" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={docIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Documents</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/inventory-items" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={stockIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>Stock</span>}
                    </NavLink>
                </li>
                <li className="nav-box">
                    <NavLink to="/inventory-items" className={({ isActive }) => `nav-text ${isActive ? 'active' : ''}`}>
                        <img src={barCodeIcon} className="nav-icon" alt="Panel" />
                        {!isCollapsed && <span>BarCodes</span>}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
