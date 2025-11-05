import React from "react";
import { Hero } from "../../components/Hero/Hero.tsx";
import { ProductsSection } from "../../components/ProductSection/ProductSection.tsx";

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ProductsSection />
      <main style={{ padding: 24 }}>
        {/* дополнительный контент */}
      </main>
    </>
  );
};