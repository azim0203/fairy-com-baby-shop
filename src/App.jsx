// Main App Component with Routing and Providers
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ToastProvider } from './components/Toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

// Layout wrapper for customer pages
function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
                <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
                <Route path="/order-success/:orderId" element={<CustomerLayout><OrderSuccess /></CustomerLayout>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
