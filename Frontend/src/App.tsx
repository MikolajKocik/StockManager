import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import ProductCreateForm from './pages/products/ProductCreateForm';
import Layout from './components/Layout';
import ProductEditForm from './pages/products/ProductEditForm';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/create" element={<ProductCreateForm />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/products/edit/:id" element={<ProductEditForm />} />
          </Route>       
        </Routes>
      </BrowserRouter>
  );
}
