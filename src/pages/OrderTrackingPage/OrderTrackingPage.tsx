import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi } from "@/services/api";
import "./OrderTrackingPage.css";

interface OrderDetails {
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerEmail: string;
  createdAt: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError("No order number provided");
        setLoading(false);
        return;
      }

      try {
        const orderData = await orderApi.trackOrder(orderNumber);
        setOrder(orderData as OrderDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="tracking-container">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-tracking-page">
        <div className="tracking-container">
          <h1>Order Not Found</h1>
          <p>{error || "We couldn't find an order with that number."}</p>
          <button onClick={() => navigate("/")} className="primary-btn">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "#10b981";
      case "processing":
      case "shipped":
        return "#3b82f6";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="order-tracking-page">
      <div className="tracking-container">
        <h1>Order Tracking</h1>
        
        <div className="order-header">
          <div className="order-number">
            <span className="label">Order Number:</span>
            <span className="value">{order.orderNumber}</span>
          </div>
          <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
            {order.status}
          </div>
        </div>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Order Date</h3>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="info-card">
            <h3>Total Amount</h3>
            <p>{order.totalAmount.toFixed(2)} ₽</p>
          </div>
          <div className="info-card">
            <h3>Email</h3>
            <p>{order.customerEmail}</p>
          </div>
        </div>

        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-info">
                  <span className="item-title">{item.title}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <div className="item-price">
                  {(item.price * item.quantity).toFixed(2)} ₽
                </div>
              </div>
            ))}
          </div>
          <div className="total-row">
            <span>Total:</span>
            <span className="total-amount">{order.totalAmount.toFixed(2)} ₽</span>
          </div>
        </div>

        <div className="tracking-actions">
          <button onClick={() => navigate("/")} className="secondary-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
