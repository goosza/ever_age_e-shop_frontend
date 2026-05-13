import React from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutSuccess.css";

const CheckoutCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-result-page">
      <div className="result-container cancel">
        <div className="result-icon cancel-icon">✕</div>
        <h1>Payment Cancelled</h1>
        <p className="result-subtitle">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="next-steps">
          <div className="info-box">
            <p>💡 Your cart items are still saved and waiting for you.</p>
            <p>🛒 You can return to your cart to complete your purchase anytime.</p>
            <p>❓ If you experienced any issues during checkout, please contact our support team.</p>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={() => navigate("/checkout")} className="primary-btn">
            Return to Cart
          </button>
          <button onClick={() => navigate("/")} className="secondary-btn">
            Continue Shopping
          </button>
        </div>

        <div className="help-section">
          <p className="help-text">
            Need help? <a href="mailto:support@example.com">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;
