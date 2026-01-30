import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import "./CheckoutPage.css";

type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "applePay" | "card";
  cardOwner: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
};

const CheckoutPage: React.FC = () => {
  const { items, updateItemQuantity, removeItem } = useCart();

  // local total calculation (right column)
  const total = items.reduce((s: number, it: { price: number; qty: number; }) => s + it.price * it.qty, 0);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "applePay",
    cardOwner: "",
    cardNumber: "",
    cardMonth: "",
    cardYear: "",
    cardCvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "cardCvv") {
      const digits = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: digits }));
      return;
    }

    if (name === "cardNumber") {
      const cleaned = value.replace(/[^0-9\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value as never }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validate minimal required fields
    // (you can extend validation as needed)
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill required fields.");
      return;
    }
    console.log("Checkout Data:", formData, "cart:", items);
    alert("Order placed successfully!");
  };

  const changeQty = (id: string, qty: number) => {
    const v = Math.max(0, Math.floor(qty || 0));
    updateItemQuantity(id, v);
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return (
      <option key={m} value={m}>
        {m}
      </option>
    );
  });
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => {
    const y = (currentYear + i).toString();
    return (
      <option key={y} value={y}>
        {y}
      </option>
    );
  });

  return (
    <main className="checkout-page">
      {/* LEFT: form (structure unchanged, fields arranged per request) */}
      <div className="checkout-left">
        <h2>Checkout</h2>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>
                First Name
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </label>
            </div>
            <div className="field">
              <label>
                Last Name
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </label>
            </div>
          </div>

          <label>
            Birth Date
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
          </label>

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Address
            <textarea name="address" value={formData.address} onChange={handleChange} />
          </label>

          <div className="form-row">
            <div className="field">
              <label>
                City
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </label>
            </div>
            <div className="field">
              <label>
                Postal Code
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
              </label>
            </div>
          </div>

          <section className="payment-section">
            <h3>Payment</h3>
            <div className="payment-options">
              <label className="radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="applePay"
                  checked={formData.paymentMethod === "applePay"}
                  onChange={handleChange}
                />
                Apple Pay
              </label>

              <label className="radio">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                />
                Card
              </label>
            </div>

            {formData.paymentMethod === "card" && (
              <div className="card-fields">
                <label>
                  Card owner
                  <input type="text" name="cardOwner" value={formData.cardOwner} onChange={handleChange} required />
                </label>

                <label>
                  Card number
                  <input
                    type="text"
                    name="cardNumber"
                    inputMode="numeric"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </label>

                <div className="form-row triple-row">
                  <div className="field">
                    <label>
                      Month
                      <select name="cardMonth" value={formData.cardMonth} onChange={handleChange} required>
                        <option value="">MM</option>
                        {monthOptions}
                      </select>
                    </label>
                  </div>

                  <div className="field">
                    <label>
                      Year
                      <select name="cardYear" value={formData.cardYear} onChange={handleChange} required>
                        <option value="">YYYY</option>
                        {yearOptions}
                      </select>
                    </label>
                  </div>

                  <div className="field">
                    <label>
                      CVV
                      <input
                        type="text"
                        name="cardCvv"
                        inputMode="numeric"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        maxLength={3}
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div style={{ marginTop: 12 }}>
            <button type="submit" className="submit-btn">
              Place Order
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: cart (controls + total) - unchanged except using changeQty/removeItem */}
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
                  <button type="button" aria-label={`Decrease ${item.title}`} onClick={() => changeQty(item.id, item.qty - 1)}>
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
                  />

                  <button type="button" aria-label={`Increase ${item.title}`} onClick={() => changeQty(item.id, item.qty + 1)}>
                    +
                  </button>

                  <button type="button" className="remove-btn" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`}>
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