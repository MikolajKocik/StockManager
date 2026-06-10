import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Home,
  ProductList,
  ProductDetails,
  Suppliers,
  Operations,
  Shipments,
  Documents,
  InventoryItems,
  Analytics,
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
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/inventory-items" element={<InventoryItems />} />

            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
