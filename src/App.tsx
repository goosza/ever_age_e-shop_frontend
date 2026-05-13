import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { Header } from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import InfoPage from "./pages/InfoPage/InfoPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import CheckoutSuccess from "./pages/CheckoutPage/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutPage/CheckoutCancel";
import OrderTrackingPage from "./pages/OrderTrackingPage/OrderTrackingPage";
import CollabPage from "./pages/CollabPage/CollabPage";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--header-height)" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/orders/track/:orderNumber" element={<OrderTrackingPage />} />
          <Route path="/collab/:id" element={<CollabPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
