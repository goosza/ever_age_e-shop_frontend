import React, { useState } from "react";
import { useCart } from "@/context/cartContextDef";
import { ZasilkovnaPickupSelector, type PickupPoint } from "@/components/ZasilkovnaPickupSelector/ZasilkovnaPickupSelector";
import "./CheckoutPage.css";

type ShippingProvider = "ZASILKOVNA" | "OTHER";

type ShippingOption = {
  method: string;
  name: string;
  description: string;
  cost: number;
  provider: string;
  available: boolean;
};

type FreeShippingInfo = {
  enabled: boolean;
  threshold: number;
  remaining: number;
};

type Country = {
  code: string;
  name: string;
};

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
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [pickupPoint, setPickupPoint] = useState<PickupPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [freeShippingInfo, setFreeShippingInfo] = useState<FreeShippingInfo | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);

  const itemsTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  // Load countries on mount
  React.useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch('/api/shipping/countries');
        if (response.ok) {
          const data = await response.json();
          setCountries(data);
        } else {
          // Fallback to default countries
          setCountries([
            { code: "CZ", name: "Czech Republic" },
            { code: "SK", name: "Slovakia" },
            { code: "PL", name: "Poland" },
            { code: "HU", name: "Hungary" },
            { code: "RO", name: "Romania" },
          ]);
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
        // Fallback
        setCountries([
          { code: "CZ", name: "Czech Republic" },
          { code: "SK", name: "Slovakia" },
        ]);
      } finally {
        // Countries loaded
      }
    };
    
    loadCountries();
  }, []);
  
  // Load shipping options when country changes
  React.useEffect(() => {
    const loadShippingOptions = async () => {
      if (!formData.country || itemsTotal === 0) return;
      
      setLoadingShipping(true);
      try {
        const response = await fetch(
          `/api/shipping/options?country=${formData.country}&orderTotal=${itemsTotal}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to load shipping options');
        }
        
        const data = await response.json();
        setShippingOptions(data.methods || []);
        setFreeShippingInfo(data.freeShippingInfo || null);
        
        // Select first available option
        const firstAvailable = data.methods?.find((opt: ShippingOption) => opt.available);
        if (firstAvailable) {
          setSelectedMethod(firstAvailable.method);
        }
      } catch (err) {
        console.error('Failed to load shipping options:', err);
        setShippingOptions([]);
        setFreeShippingInfo(null);
      } finally {
        setLoadingShipping(false);
      }
    };
    
    loadShippingOptions();
  }, [formData.country, itemsTotal]);
  
  // Get shipping cost from loaded options
  const getShippingCost = () => {
    const option = shippingOptions.find(opt => opt.method === selectedMethod);
    return option?.cost || 0;
  };
  
  const shippingCost = getShippingCost();
  const total = itemsTotal + shippingCost;
  
  const needsPickupPoint = ['PICKUP', 'ZBOX', 'CARRIER_PICKUP'].includes(selectedMethod);
  const needsAddress = selectedMethod === 'HOME';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            method: selectedMethod,
            cost: shippingCost,
            provider: shippingOptions.find(opt => opt.method === selectedMethod)?.provider || "ZASILKOVNA",
            pickupPointId: pickupPoint.id,
            pickupPointName: pickupPoint.name,
            pickupPointAddress: pickupPoint.address,
          }
        : {
            method: selectedMethod,
            cost: shippingCost,
            provider: shippingOptions.find(opt => opt.method === selectedMethod)?.provider || "ZASILKOVNA",
          };

      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            itemId: item.id,
            quantity: item.qty,
          })),
          customerInfo,
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

          <label>
            Country *
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
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
              
              {/* Free Shipping Info */}
              {freeShippingInfo?.enabled && (
                <div className={`free-shipping-banner ${freeShippingInfo.remaining === 0 ? 'active' : ''}`}>
                  {freeShippingInfo.remaining === 0 ? (
                    <p>🎉 Free shipping activated!</p>
                  ) : (
                    <p>Add {freeShippingInfo.remaining.toFixed(2)} CZK more for free shipping!</p>
                  )}
                </div>
              )}
              
              {loadingShipping ? (
                <p className="loading-message">Loading shipping options...</p>
              ) : shippingOptions.length === 0 ? (
                <p className="error-message">No shipping options available for selected country</p>
              ) : (
                <div className="shipping-options">
                  {shippingOptions.map((option) => (
                    <label key={option.method} className="shipping-option">
                      <div className="shipping-option-content">
                        <div className="shipping-left">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={option.method}
                            checked={selectedMethod === option.method}
                            onChange={(e) => {
                              setSelectedMethod(e.target.value);
                              setPickupPoint(null);
                            }}
                            disabled={loading || !option.available}
                          />
                          <div className="shipping-details">
                            <span className="shipping-name">{option.name}</span>
                            <span className="shipping-desc">{option.description}</span>
                          </div>
                        </div>
                        <span className="shipping-price">
                          {option.cost === 0 ? 'FREE' : `${option.cost.toFixed(2)} CZK`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
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
                deliveryMethod={selectedMethod as any}
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