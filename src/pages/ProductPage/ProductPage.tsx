import React from "react";
import { useParams } from "react-router-dom";
import { products } from "../../data/products";
import "./ProductPage.css";


const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const product = products.find((p) => p.id === id) ?? null;

    if (!product) {
        return (
            <main className="product-page">
                <div>Product not found.</div>
            </main>
        );
    }

    const images = [
        product.image,
        "/products/product-one-alt1.jpg",
        "/products/product-one-alt2.jpg",
    ];

    return (
        <>

            <main className="product-page">
                <div className="product-left">
                    <div className="product-images">
                        {images.map((src, index) => (
                            <img key={index} src={src} alt={`${product.title} ${index + 1}`} className="product-image" />
                        ))}
                    </div>
                </div>
                <div className="product-right">
                    <div className="product-info">
                        <h1 className="product-title">{product.title}</h1>
                        <p className="product-description">{product.shortDescription}</p>
                        <p className="product-availability">
                            {product.available ? "In Stock" : "Out of Stock"}
                        </p>
                        <button className="add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ProductPage;