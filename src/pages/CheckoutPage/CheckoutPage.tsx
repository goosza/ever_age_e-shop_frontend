import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

const CheckoutPage: React.FC = () => {
    const { items } = useCart();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        address: "",
        paymentMethod: "applePay",
        cardDetails: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Checkout Data:", formData);
        alert("Order placed successfully!");
    };

    return (
        <main className="checkout-page">
            <div className="checkout-left">
                <h2>Checkout</h2>
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </label>
                    <label>
                        Birth Date:
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Address:
                        <textarea name="address" value={formData.address} onChange={handleChange} required></textarea>
                    </label>
                    <label>
                        Payment Method:
                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option value="applePay">Apple Pay</option>
                            <option value="bankTransfer">Bank Transfer</option>
                        </select>
                    </label>
                    {formData.paymentMethod === "bankTransfer" && (
                        <label>
                            Card Details:
                            <input type="text" name="cardDetails" value={formData.cardDetails} onChange={handleChange} required />
                        </label>
                    )}
                    <button type="submit" className="submit-btn">Place Order</button>
                </form>
            </div>
            <div className="checkout-right">
                <h2>Your Cart</h2>
                <ul className="cart-items">
                    {items.map((item) => (
                        <li key={item.id} className="cart-item">
                            <img src={item.image} alt={item.title} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3>{item.title}</h3>
                                <p>Price: {item.price} ₽</p>
                                <p>Quantity: {item.qty}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default CheckoutPage;