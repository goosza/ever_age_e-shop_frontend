import React from "react";
import "./ProductSection.css";

type Product = { id: string; name: string; price: number; image?: string };

const SAMPLE_PRODUCTS: Product[] = [
  { id: "p1", name: "Product One", price: 19.99, image: "/placeholder.png" },
  { id: "p2", name: "Product Two", price: 29.99, image: "/placeholder.png" },
  { id: "p3", name: "Product Three", price: 39.99, image: "/placeholder.png" },
  { id: "p4", name: "Product Four", price: 49.99, image: "/placeholder.png" },
  { id: "p5", name: "Product Five", price: 59.99, image: "/placeholder.png" },
  { id: "p6", name: "Product Six", price: 69.99, image: "/placeholder.png" },
  { id: "p7", name: "Product Seven", price: 79.99, image: "/placeholder.png" },
  { id: "p8", name: "Product Eight", price: 89.99, image: "/placeholder.png" },
];

export const ProductsSection: React.FC = () => {
  return (
    <section id="products" className="products-section">
      <div className="products-inner">
        <h2 className="products-title">Товары</h2>
        <div className="products-grid">
          {SAMPLE_PRODUCTS.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-thumb" style={{ backgroundImage: `url(${p.image})` }} />
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price.toFixed(2)} ₽</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};