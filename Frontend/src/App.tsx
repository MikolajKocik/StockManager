import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Home,
  LoginPage,
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
  const { isAuthenticated } = useAuth();

  return isAuthenticated ?
    <>{children}</> :
    <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
