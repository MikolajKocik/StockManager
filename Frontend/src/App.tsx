import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" /*dashboard*//>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
