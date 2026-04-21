import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import Layout from './components/Layout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Operations from './pages/Operations';
import Documents from './pages/Documents';
import { AuthProvider, useAuth } from './context/AuthContext';

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
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/documents" element={<Documents />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
