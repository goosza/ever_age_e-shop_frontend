import React from "react";
import "./ProductSection.css";
import { Link } from "react-router-dom";
import {products} from "@/data/products.ts";


export const ProductsSection: React.FC = () => {
  return (
    <section id="products" className="products-section">
      <div className="products-inner">
        <h2 className="products-title">Products</h2>
        <div className="products-grid">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="product-card">
              <div className="product-thumb" style={{ backgroundImage: `url(${p.image})` }} />
              <div className="product-body">
                <div className="product-name">{p.title}</div>
                <div className="product-price">{p.price.toFixed(2)} ₽</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};