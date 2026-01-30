import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { products } from "@/data/products";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header/Header";
import InfoPage from "@/pages/InfoPage/InfoPage";
import ProductPage from "@/pages/ProductPage/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage/CheckoutPage";
import CollabPage from "@/pages/CollabPage/CollabPage";
import useHeaderHeight from "@/hooks/useHeaderHeight";

const App: React.FC = () => {
  const headerHeight = useHeaderHeight();

  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main className="main-content" style={{ paddingTop: headerHeight }}>
          <Routes>
            <Route path="/" element={<Navigate to={`/product/${products[0].id}`} replace />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/collab/:id" element={<CollabPage />} />
            <Route path="*" element={<Navigate to={`/product/${products[0].id}`} replace />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;