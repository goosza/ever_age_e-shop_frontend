import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import "./Header.css";

export const Header: React.FC = () => {
  const { items, itemCount, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const hero = document.querySelector("#hero");

    if (!hero || location.pathname.startsWith("/product")) {
      setScrolled(true);
      return;
    }

    const io = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { root: null, threshold: 0.05 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [location.pathname]);

  const handleCheckout = () => {
    navigate("/checkout");
    setOpen(false);
  };

  return (
      <header className={`app-header ${scrolled ? "scrolled" : "transparent"}`}>
        <div className="header-left">
          <Link to="/info" className="info-button" aria-label="Info">INFO</Link>
        </div>

        <div className="header-center">
          <Link to="/">
            <img src="/logo.svg" alt="logo" className="header-logo" />
          </Link>
        </div>

        <div className="header-right" ref={popupRef}>
          <button className="cart-button" onClick={() => setOpen((s) => !s)} aria-label="Корзина">
            <svg className="cart-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6h15l-1.5 9h-11L6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="20" r="1" fill="currentColor"/>
              <circle cx="18" cy="20" r="1" fill="currentColor"/>
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {open && (
              <div className="cart-popup">
                {items.length === 0 ? (
                    <div className="cart-empty">The Cart is empty</div>
                ) : (
                    <>
                      {items.map((it) => (
                          <div key={it.id} className="cart-row">
                            <img src={it.image ?? "/placeholder.png"} alt={it.title} className="cart-thumb" />
                            <div className="cart-info">
                              <div className="cart-title">{it.title}</div>
                              <div className="cart-meta">
                                <span>{it.qty} × {it.price.toFixed(2)} ₽</span>
                              </div>
                            </div>
                            <button className="cart-remove" onClick={() => removeItem(it.id)}>Убрать</button>
                          </div>
                      ))}
                      <button className="checkout-btn" onClick={handleCheckout}>
                        Checkout
                      </button>
                    </>
                )}
              </div>
          )}
        </div>
      </header>
  );
};