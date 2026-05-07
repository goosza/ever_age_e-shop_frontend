import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/context/productContextDef";
import type { Product } from "@/data/products";
import "./ProductSection.css";

export const ProductsSection: React.FC = () => {
  const { products } = useProducts();

  return (
    <section id="products" className="products-section">
      <div className="products-inner">
        <h2 className="products-title">Products</h2>
        <div className="products-grid">
          {products.map((p: Product) => (
            <Link to={`/product/${p.uuid}`} key={p.uuid} className="product-card">
              <div
                className="product-thumb"
                style={{ backgroundImage: `url(${p.imageUrls?.[0] ?? ""})` }}
              />
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price.toFixed(2)} ₽</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
