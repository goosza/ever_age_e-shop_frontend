import React from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/context/productContext";
import { useCart } from "@/context/cartContext";
import "./ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, loading } = useProducts();
  const { addItem } = useCart();

  if (loading) return <div>Loading...</div>;

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <main className="product-page">
        <div>Product not found.</div>
      </main>
    );
  }

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
