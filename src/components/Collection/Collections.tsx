import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/context/productContextDef";
import type { Product } from "@/data/products";
import "./Collections.css";

interface CollectionGroup {
  name: string;
  img: string;
}

export default function Collections() {
  const { products } = useProducts();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth <= 900
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const collections = useMemo<CollectionGroup[]>(() => {
    const groups = products.reduce<Record<string, string[]>>((acc, p: Product) => {
      if (!p.collection) return acc;
      (acc[p.collection] ||= []).push(p.imageUrls?.[0] ?? "/placeholder.png");
      return acc;
    }, {});
    return Object.entries(groups).map(([name, imgs]) => ({ name, img: imgs[0] }));
  }, [products]);

  const toggle = (name: string) =>
    setActiveCollection((prev) => (prev === name ? null : name));

  const activeBg = activeCollection
    ? collections.find((c) => c.name === activeCollection)?.img ?? ""
    : "";

  return (
    <section className="collections-section" aria-label="Collections">
      <div className={`collections-inner ${activeCollection ? "expanded" : ""}`}>
        <h2 className="collections-title">Collections</h2>

        <div className="collections-layout">
          <div className="collections-list" role="list">
            {collections.map((c) => {
              const isActive = c.name === activeCollection;
              const collectionProducts = products.filter((p: Product) => p.collection === c.name);
              return (
                <div key={c.name} role="listitem" className="collection-block">
                  <button
                    className={`collection-card ${isActive ? "active" : ""}`}
                    style={{ backgroundImage: `url(${c.img})` }}
                    onClick={() => toggle(c.name)}
                    aria-pressed={isActive}
                    aria-label={`Toggle collection ${c.name}`}
                  >
                    <div className="collection-overlay">
                      <div className="collection-name">{c.name}</div>
                    </div>
                  </button>

                  {isMobile && isActive && (
                    <div
                      className="collection-products has-bg inline"
                      style={{ backgroundImage: c.img ? `url(${c.img})` : undefined }}
                      aria-live="polite"
                    >
                      <div className="collection-products-inner">
                        <h3 className="collection-products-title">Products — {c.name}</h3>
                        <div className="products-grid">
                          {collectionProducts.map((p: Product) => (
                            <Link key={p.uuid} to={`/product/${p.uuid}`} className="product-card">
                              <div
                                className="product-thumb"
                                style={{ backgroundImage: `url(${p.imageUrls?.[0] ?? "/placeholder.png"})` }}
                              />
                              <div className="product-info">
                                <div className="product-title">{p.name}</div>
                                <div className="product-price">{Number(p.price).toFixed(2)} ₽</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isMobile && activeCollection && (
            <div
              className="collection-products has-bg"
              style={{ backgroundImage: activeBg ? `url(${activeBg})` : undefined }}
              aria-live="polite"
            >
              <div className="collection-products-inner">
                <h3 className="collection-products-title">Products — {activeCollection}</h3>
                <div className="products-grid">
                  {products
                    .filter((p: Product) => p.collection === activeCollection)
                    .map((p: Product) => (
                      <Link key={p.uuid} to={`/product/${p.uuid}`} className="product-card">
                        <div
                          className="product-thumb"
                          style={{ backgroundImage: `url(${p.imageUrls?.[0] ?? "/placeholder.png"})` }}
                        />
                        <div className="product-info">
                          <div className="product-title">{p.name}</div>
                          <div className="product-price">{Number(p.price).toFixed(2)} ₽</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
