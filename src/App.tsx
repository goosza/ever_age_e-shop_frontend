import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { useProducts } from "./context/productContext";
import { useHeaderHeight } from "./hooks/useHeaderHeight";
import { Header } from "./components/Header/Header";
import InfoPage from "./pages/InfoPage/InfoPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import CollabPage from "./pages/CollabPage/CollabPage";

const AppRoutes: React.FC = () => {
  const { products, loading } = useProducts();
  const headerHeight = useHeaderHeight();

  if (loading) return <div>Loading...</div>;
  if (!products.length || !products[0]?.uuid) return <div>No products available</div>;

  return (
    <>
      <Header />
      <main style={{ paddingTop: headerHeight }}>
        <Routes>
          <Route path="/" element={<Navigate to={`/product/${products[0].uuid}`} replace />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/collab/:id" element={<CollabPage />} />
          <Route path="*" element={<Navigate to={`/product/${products[0].uuid}`} replace />} />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <AppRoutes />
        </ProductProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
