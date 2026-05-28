import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { CartProvider } from './context/CartContext';

import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.themeParams?.bg_color) {
        tg.setHeaderColor(tg.themeParams.bg_color);
      }
    }
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-yellow animate-pulse">
            <span className="text-lg font-black text-primary-foreground">B</span>
          </div>
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <CartProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<SellerDashboard />} />
        </Route>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </CartProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App