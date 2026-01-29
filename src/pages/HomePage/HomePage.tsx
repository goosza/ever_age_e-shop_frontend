import React from "react";
import { Hero } from "../../components/Hero/Hero.tsx";
import { ProductsSection } from "../../components/ProductSection/ProductSection.tsx";
import Collaborations from "../../components/Collaborations/Collaborations.tsx";
import { Footer } from "../../components/Footer/Footer.tsx";



export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ProductsSection />
      <Collaborations />
      <Footer />
      <main style={{ padding: 24 }}>
        {/* дополнительный контент */}
      </main>
    </>
  );
};