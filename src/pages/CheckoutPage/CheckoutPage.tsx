import React, { useState } from "react";
import { useCart } from "@/context/cartContext";
import "./CheckoutPage.css";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
};

const CheckoutPage: React.FC = () => {
  const { items, updateItemQuantity, removeItem } = useCart();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill all required fields");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo: formData,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.statusText}`);
      }

      const { sessionUrl } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create checkout session");
      setLoading(false);
    }
  };

  const changeQty = (id: string, qty: number) => {
    const v = Math.max(0, Math.floor(qty || 0));
    updateItemQuantity(id, v);
  };

  return (
    <main className="checkout-page">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>
                First Name *
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Last Name *
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          <label>
            Email *
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label>
            Address
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <div className="form-row">
            <div className="field">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Postal Code
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>

      <div className="checkout-right">
        <h2>Your Cart</h2>

        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image ?? "/placeholder.png"} alt={item.title} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>Price: {item.price} ₽</p>

                <div className="cart-item-controls">
                  <button
                    type="button"
                    aria-label={`Decrease ${item.title}`}
                    onClick={() => changeQty(item.id, item.qty - 1)}
                    disabled={loading}
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      changeQty(item.id, Number.isNaN(v) ? 0 : v);
                    }}
                    className="qty-input"
                    aria-label={`Quantity for ${item.title}`}
                    disabled={loading}
                  />

                  <button
                    type="button"
                    aria-label={`Increase ${item.title}`}
                    onClick={() => changeQty(item.id, item.qty + 1)}
                    disabled={loading}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title}`}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="checkout-total">
          <div className="total-row">
            <span>Items:</span>
            <span>{items.reduce((s, it) => s + it.qty, 0)}</span>
          </div>
          <div className="total-row total-amount">
            <strong>Total to pay:</strong>
            <strong>{total.toFixed(2)} ₽</strong>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;