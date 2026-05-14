import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/cartContextDef";
import "./CheckoutSuccess.css";

interface OrderInfo {
  orderNumber?: string;
  totalAmount?: number;
  items?: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  customerEmail?: string;
}

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderInfo = async () => {
      // Clear cart
      clearCart();

      if (!sessionId) {
        setOrder({});
        setLoading(false);
        return;
      }

      // Try localStorage first
      const storedOrder = localStorage.getItem("lastOrder");
      if (storedOrder) {
        try {
          setOrder(JSON.parse(storedOrder));
          localStorage.removeItem("lastOrder");
        } catch (err) {
          console.error("Error parsing stored order:", err);
        }
      }

      // Then try backend
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
        const response = await fetch(`${API_BASE_URL}/orders/by-session/${sessionId}`);
        
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        }
      } catch (err) {
        console.log("Backend order endpoint not available yet:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  if (loading) {
    return (
      <div className="checkout-result-page">
        <div className="result-container loading">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-result-page">
      <div className="result-container success">
        <div className="result-icon success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="result-subtitle">Thank you for your purchase.</p>

        {order?.orderNumber && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              <div className="info-row">
                <span className="info-label">Order Number:</span>
                <span className="info-value">{order.orderNumber}</span>
              </div>
              {order.totalAmount !== undefined && (
                <div className="info-row">
                  <span className="info-label">Total Amount:</span>
                  <span className="info-value">{order.totalAmount.toFixed(2)} ₽</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.customerEmail}</span>
                </div>
              )}
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items">
                <h3>Items Ordered:</h3>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.title}</span>
                      <span className="item-details">
                        {item.quantity} × {item.price.toFixed(2)} ₽
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="next-steps">
          <div className="info-box">
            <p>📧 You will receive an email confirmation shortly at your registered email address.</p>
            <p>📦 We'll notify you when your order ships.</p>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={() => navigate("/")} className="primary-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
