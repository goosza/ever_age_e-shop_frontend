import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/context/cartContextDef";
import "./CheckoutSuccess.css";

interface OrderItem {
  name?: string;
  title?: string;
  quantity: number;
  price: number;
}

interface OrderInfo {
  uuid?: string;
  orderNumber?: string;
  totalAmount?: number;
  status?: string;
  items?: OrderItem[];
  customerEmail?: string;
  shipping?: {
    trackingNumber?: string;
    trackingUrl?: string;
    pickupPointName?: string;
    pickupPointAddress?: string;
    estimatedDelivery?: string;
    status?: string;
  };
}

const RETRY_INTERVAL_MS = 2000;
const MAX_RETRIES = 15; // 30 секунд

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "retrying" | "success" | "timeout">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setStatus("timeout");
      return;
    }

    const tryFetch = async (attempt: number) => {
      try {
        const response = await fetch(`/api/orders/by-session/${sessionId}`);

        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
          setStatus("success");
          return;
        }

        // 404 — webhook ещё не пришёл, retry
        if (response.status === 404) {
          if (attempt >= MAX_RETRIES) {
            setStatus("timeout");
            return;
          }
          setRetryCount(attempt + 1);
          setStatus("retrying");
          retryTimer.current = setTimeout(() => tryFetch(attempt + 1), RETRY_INTERVAL_MS);
          return;
        }

        // Другая ошибка
        setStatus("timeout");
      } catch {
        if (attempt >= MAX_RETRIES) {
          setStatus("timeout");
          return;
        }
        setRetryCount(attempt + 1);
        setStatus("retrying");
        retryTimer.current = setTimeout(() => tryFetch(attempt + 1), RETRY_INTERVAL_MS);
      }
    };

    tryFetch(0);

    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Loading / retrying
  if (status === "loading" || status === "retrying") {
    return (
      <div className="checkout-result-page">
        <div className="result-container loading">
          <div className="spinner"></div>
          <p className="loading-title">Processing your order...</p>
          {status === "retrying" && (
            <p className="loading-sub">
              Confirming payment with Stripe ({retryCount}/{MAX_RETRIES})
            </p>
          )}
        </div>
      </div>
    );
  }

  // Timeout — webhook не пришёл за 30 сек
  if (status === "timeout") {
    return (
      <div className="checkout-result-page">
        <div className="result-container pending">
          <div className="result-icon pending-icon">⏳</div>
          <h1>Order is being processed</h1>
          <p className="result-subtitle">
            Your payment was received, but the order confirmation is taking longer than usual.
          </p>
          <div className="next-steps">
            <div className="info-box">
              <p>📧 You will receive an email confirmation once the order is confirmed.</p>
              <p>📦 This usually takes just a few minutes.</p>
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
  }

  // Success — заказ найден
  return (
    <div className="checkout-result-page">
      <div className="result-container success">
        <div className="result-icon success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p className="result-subtitle">Thank you for your purchase.</p>

        {order && (
          <div className="order-details">
            <h2>Order Details</h2>
            <div className="order-info">
              {order.orderNumber && (
                <div className="info-row">
                  <span className="info-label">Order Number:</span>
                  <span className="info-value">{order.orderNumber}</span>
                </div>
              )}
              {order.totalAmount !== undefined && (
                <div className="info-row">
                  <span className="info-label">Total:</span>
                  <span className="info-value">{order.totalAmount.toFixed(2)} CZK</span>
                </div>
              )}
              {order.customerEmail && (
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.customerEmail}</span>
                </div>
              )}
            </div>

            {order.shipping && (
              <div className="shipping-details">
                <h3>Shipping</h3>
                {order.shipping.trackingNumber && (
                  <div className="info-row">
                    <span className="info-label">Tracking:</span>
                    <span className="info-value">
                      {order.shipping.trackingUrl ? (
                        <a href={order.shipping.trackingUrl} target="_blank" rel="noopener noreferrer">
                          {order.shipping.trackingNumber}
                        </a>
                      ) : (
                        order.shipping.trackingNumber
                      )}
                    </span>
                  </div>
                )}
                {order.shipping.pickupPointName && (
                  <div className="info-row">
                    <span className="info-label">Pick-up Point:</span>
                    <span className="info-value">{order.shipping.pickupPointName}</span>
                  </div>
                )}
                {order.shipping.estimatedDelivery && (
                  <div className="info-row">
                    <span className="info-label">Estimated Delivery:</span>
                    <span className="info-value">
                      {new Date(order.shipping.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {order.items && order.items.length > 0 && (
              <div className="order-items">
                <h3>Items Ordered:</h3>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <span className="item-name">{item.name ?? item.title}</span>
                      <span className="item-details">
                        {item.quantity} × {item.price.toFixed(2)} CZK
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
            <p>📧 You will receive an email confirmation shortly.</p>
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
