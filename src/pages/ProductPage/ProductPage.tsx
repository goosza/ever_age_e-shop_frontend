import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "@/services/api";
import { useCart } from "@/context/cartContextDef";
import type { Product } from "@/data/products";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    productApi
      .getById(id)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load product");
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  const isAvailable = product.status === "ACTIVE";

  const handleAddToCart = () => {
    addItem({
      id: product.uuid,
      title: product.name,
      price: product.price,
      image: product.imageUrls[0],
      qty: 1,
    });
  };

  return (
    <main className="product-page">
      <div className="product-left">
        <div className="product-images">
          {product.imageUrls.map((src, index) => (
            <img key={index} src={src} alt={`${product.name} ${index + 1}`} className="product-image" />
          ))}
        </div>
      </div>

      <div className="product-right">
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-availability">{isAvailable ? "IN STOCK" : "OUT OF STOCK"}</p>
          {isAvailable && (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
