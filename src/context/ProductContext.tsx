import { useState } from "react";
import type { ReactNode } from "react";
import { productApi } from "../services/api";
import type { Product } from "../data/products";
import { ProductContext } from "./productContextDef";

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // false по умолчанию
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadProducts = () => {
    if (hasLoaded || loading) return; // Не загружать повторно
    
    setLoading(true);
    setHasLoaded(true);
    
    productApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  const getProductById = (id: string) => products.find((p) => p.uuid === id);

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById, loadProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
