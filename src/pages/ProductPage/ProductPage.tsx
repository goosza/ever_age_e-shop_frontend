import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../../data/products";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id) ?? null;

  if (!product) {
    return (
      <main className="product-page">
        <div>Product not found.</div>
        <button onClick={() => navigate(-1)}>Go back</button>
      </main>
    );
  }

  return (
    <main className="product-page">
      <div className="product-media">
        <img src={product.image ?? "/placeholder.png"} alt={product.title} style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">{typeof product.price === "number" ? `$${product.price}` : "—"}</p>
        <p className="desc">{product.shortDescription}</p>
        <button
          className="checkout-btn"
          onClick={() => {
            navigate("/checkout", { state: { productId: product.id } });
          }}
        >
          Checkout
        </button>
      </div>
    </main>
  );
};

export default ProductPage;