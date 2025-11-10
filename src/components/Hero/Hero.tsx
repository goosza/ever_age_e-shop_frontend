// ...existing code...
import React, { useEffect, useState } from "react";
import "./Hero.css";

const SLIDES = ["/hero1.jpg", "/hero2.jpg", "/hero3.png"];

export const Hero: React.FC = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollToProducts = () => {
    const target = document.getElementById("products");
    if (!target) {
      console.error("Element with id 'products' not found.");
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="hero" style={{ backgroundImage: `url(${SLIDES[idx]})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <p className="hero-sub">
            Welcome to Ever Age Accessories, a visionary brand specializing in 3D printed accessories.
            Explore our unique collection of 3D printed lighter cases and jewelry.
          </p>
          <button className="hero-cta" onClick={scrollToProducts}>BUY SMTH</button>
        </div>
      </div>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} aria-label={`Слайд ${i+1}`} />
        ))}
      </div>
    </section>
  );
};
// ...existing code...