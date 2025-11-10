// ...existing code...
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header/Header";
import { InfoPage } from "./pages/InfoPage";
import { HomePage } from "./pages/HomePage/HomePage";
import  ProductPage  from "./pages/ProductPage/ProductPage";


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="*" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
// ...existing code...