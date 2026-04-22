import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { productApi } from "../services/api";
import type { Product } from "../data/products";
import { ProductContext } from "./productContext";

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const getProductById = (id: string) => products.find((p) => p.uuid === id);

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
