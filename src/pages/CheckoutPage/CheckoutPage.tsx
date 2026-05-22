import React, { useState } from "react";
import { useCart } from "@/context/cartContextDef";
import { ZasilkovnaPickupSelector, type PickupPoint } from "@/components/ZasilkovnaPickupSelector/ZasilkovnaPickupSelector";
import "./CheckoutPage.css";

type ShippingProvider = "ZASILKOVNA" | "OTHER";
type ZasilkovnaMethod = "PICKUP" | "ZBOX" | "HOME" | "CARRIER_PICKUP";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const CheckoutPage: React.FC = () => {
  const { items, updateItemQuantity, removeItem } = useCart();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "CZ",
  });
  const [shippingProvider, setShippingProvider] = useState<ShippingProvider>("ZASILKOVNA");
  const [zasilkovnaMethod, setZasilkovnaMethod] = useState<ZasilkovnaMethod>("PICKUP");
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  // Shipping costs based on provider and method
  const getShippingCost = () => {
    if (shippingProvider === "ZASILKOVNA") {
      switch (zasilkovnaMethod) {
        case "PICKUP": return 12.00;
        case "ZBOX": return 10.00;
        case "HOME": return 25.00;
        case "CARRIER_PICKUP": return 15.00;
        default: return 0;
      }
    }
    return 0; // OTHER provider - to be implemented
  };
  
  const shippingCost = getShippingCost();
  const total = itemsTotal + shippingCost;
  
  const needsPickupPoint = shippingProvider === "ZASILKOVNA" && 
    (zasilkovnaMethod === "PICKUP" || zasilkovnaMethod === "ZBOX" || zasilkovnaMethod === "CARRIER_PICKUP");
  
  const needsAddress = shippingProvider === "OTHER" || (shippingProvider === "ZASILKOVNA" && zasilkovnaMethod === "HOME");

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

    // Validate pickup point for pickup methods
    if (needsPickupPoint && !pickupPoint) {
      setError("Please select a pickup point");
      return;
    }

    // Validate address for home delivery
    if (needsAddress && (!formData.address || !formData.city || !formData.postalCode)) {
      setError("Please fill in delivery address");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare customer info - only include address fields if needed
      const customerInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        ...(needsAddress && {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        }),
      };

      const shippingInfo = needsPickupPoint && pickupPoint
        ? {
            provider: shippingProvider,
            method: zasilkovnaMethod,
            cost: shippingCost,
            pickupPointId: pickupPoint.id,
            pickupPointName: pickupPoint.name,
            pickupPointAddress: pickupPoint.address,
          }
        : {
            provider: shippingProvider,
            method: shippingProvider === "ZASILKOVNA" ? zasilkovnaMethod : "STANDARD",
            cost: shippingCost,
          };

      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerInfo,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.qty,
            price: item.price,
          })),
          shippingInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Checkout failed: ${response.statusText}`);
      }

      const { sessionUrl } = await response.json();
      
      // Store order info in localStorage as fallback
      localStorage.setItem("lastOrder", JSON.stringify({
        customerEmail: formData.email,
        totalAmount: total,
        items: items.map(item => ({
          title: item.title,
          quantity: item.qty,
          price: item.price,
        })),
      }));
      
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
            Phone *
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          {/* Shipping Provider Selection */}
          <div className="shipping-method-section">
            <h3>Step 1: Choose Shipping Provider</h3>
            <div className="shipping-providers">
              
              <label className="provider-option">
                <input
                  type="radio"
                  name="shippingProvider"
                  value="ZASILKOVNA"
                  checked={shippingProvider === "ZASILKOVNA"}
                  onChange={(e) => {
                    setShippingProvider(e.target.value as ShippingProvider);
                    setPickupPoint(null);
                  }}
                  disabled={loading}
                />
                <div className="provider-content">
                  <span className="provider-name">Zásilkovna</span>
                  <span className="provider-desc">Multiple delivery options</span>
                </div>
              </label>

              <label className="provider-option">
                <input
                  type="radio"
                  name="shippingProvider"
                  value="OTHER"
                  checked={shippingProvider === "OTHER"}
                  onChange={(e) => {
                    setShippingProvider(e.target.value as ShippingProvider);
                    setPickupPoint(null);
                  }}
                  disabled={loading}
                />
                <div className="provider-content">
                  <span className="provider-name">Other</span>
                  <span className="provider-desc">Coming soon</span>
                </div>
              </label>

            </div>
          </div>

          {/* Delivery Method Selection - Zasilkovna */}
          {shippingProvider === "ZASILKOVNA" && (
            <div className="shipping-method-section">
              <h3>Step 2: Choose Delivery Method</h3>
              <div className="shipping-options">
                
                <label className="shipping-option">
                  <div className="shipping-option-content">
                    <div className="shipping-left">
                      <input
                        type="radio"
                        name="zasilkovnaMethod"
                        value="PICKUP"
                        checked={zasilkovnaMethod === "PICKUP"}
                        onChange={(e) => {
                          setZasilkovnaMethod(e.target.value as ZasilkovnaMethod);
                          setPickupPoint(null);
                        }}
                        disabled={loading}
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">Pick-up Point</span>
                        <span className="shipping-desc">Physical location, COD available</span>
                      </div>
                    </div>
                    <span className="shipping-price">12.00 ₽</span>
                  </div>
                </label>

                <label className="shipping-option">
                  <div className="shipping-option-content">
                    <div className="shipping-left">
                      <input
                        type="radio"
                        name="zasilkovnaMethod"
                        value="ZBOX"
                        checked={zasilkovnaMethod === "ZBOX"}
                        onChange={(e) => {
                          setZasilkovnaMethod(e.target.value as ZasilkovnaMethod);
                          setPickupPoint(null);
                        }}
                        disabled={loading}
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">Z-BOX (24/7)</span>
                        <span className="shipping-desc">Automated locker</span>
                      </div>
                    </div>
                    <span className="shipping-price">10.00 ₽</span>
                  </div>
                </label>

                <label className="shipping-option">
                  <div className="shipping-option-content">
                    <div className="shipping-left">
                      <input
                        type="radio"
                        name="zasilkovnaMethod"
                        value="HOME"
                        checked={zasilkovnaMethod === "HOME"}
                        onChange={(e) => {
                          setZasilkovnaMethod(e.target.value as ZasilkovnaMethod);
                          setPickupPoint(null);
                        }}
                        disabled={loading}
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">Home Delivery</span>
                        <span className="shipping-desc">Direct to address</span>
                      </div>
                    </div>
                    <span className="shipping-price">25.00 ₽</span>
                  </div>
                </label>

                <label className="shipping-option">
                  <div className="shipping-option-content">
                    <div className="shipping-left">
                      <input
                        type="radio"
                        name="zasilkovnaMethod"
                        value="CARRIER_PICKUP"
                        checked={zasilkovnaMethod === "CARRIER_PICKUP"}
                        onChange={(e) => {
                          setZasilkovnaMethod(e.target.value as ZasilkovnaMethod);
                          setPickupPoint(null);
                        }}
                        disabled={loading}
                      />
                      <div className="shipping-details">
                        <span className="shipping-name">Carrier Pick-up</span>
                        <span className="shipping-desc">External carrier locations</span>
                      </div>
                    </div>
                    <span className="shipping-price">15.00 ₽</span>
                  </div>
                </label>

              </div>
            </div>
          )}

          {/* Other Provider - Coming Soon */}
          {shippingProvider === "OTHER" && (
            <div className="shipping-method-section">
              <h3>Step 2: Choose Delivery Method</h3>
              <div className="coming-soon-message">
                <p>Other delivery providers coming soon!</p>
                <p>Please select Zásilkovna for now.</p>
              </div>
            </div>
          )}

          {/* Pickup Point Selector - show for Packeta pickup methods */}
          {needsPickupPoint && (
            <div className="zasilkovna-section">
              <ZasilkovnaPickupSelector
                apiKey={import.meta.env.VITE_ZASILKOVNA_API_KEY || ""}
                country={formData.country}
                language="en"
                deliveryMethod={zasilkovnaMethod}
                onSelect={setPickupPoint}
              />
            </div>
          )}

          {/* Address fields - show when address is needed */}
          {needsAddress && (
            <>
              <label>
                Address *
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Street and house number"
                />
              </label>

              <div className="form-row">
                <div className="field">
                  <label>
                    City *
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </label>
                </div>
                <div className="field">
                  <label>
                    Postal Code *
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || (needsPickupPoint && !pickupPoint)}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          {needsPickupPoint && !pickupPoint && (
            <p className="pickup-warning">Please select a pickup point to continue</p>
          )}
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
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{itemsTotal.toFixed(2)} ₽</span>
          </div>
          <div className="total-row">
            <span>Shipping:</span>
            <span>{shippingCost.toFixed(2)} ₽</span>
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