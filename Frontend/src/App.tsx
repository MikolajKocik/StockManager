import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/layout/Layout';
import {
  Home,
  ProductList,
  Suppliers,
  Operations,
  Shipments,
  Documents,
  InventoryItems,
  Maintenance,
  BarCodes,
  BinMap,
  Manage,
  ReorderRules,
  Customers,
  Returns,
  AuditLog,
  Invoices,
  NotFound
} from '@/pages';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthenticating } = useAuth();

  if (isAuthenticating) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3>Connecting to WMS Backend...</h3>
        <p>Authenticating in background...</p>
      </div>
    );
  }

  return isAuthenticated ?
    <>{children}</> :
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontFamily: 'sans-serif' }}>
      <h3>Authentication Failed</h3>
      <p>Please ensure that the backend API database/infrastructure is running.</p>
    </div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/stock" element={<InventoryItems />} />
            <Route path="/inventory-items" element={<InventoryItems />} />
            <Route path="/barcodes" element={<BarCodes />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/bin-map" element={<BinMap />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/reorder-rules" element={<ReorderRules />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/invoices" element={<Invoices />} />

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
