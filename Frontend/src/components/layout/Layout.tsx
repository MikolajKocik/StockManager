import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="bg-[#37393B] p-[0.7rem]">
                <h1>StockManager</h1>
            </header>

            <div className="grid grid-cols-[max-content_1fr] flex-1 overflow-hidden">
                <Navbar />
                <main className="overflow-y-auto p-4 bg-[#C1C3C3]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
