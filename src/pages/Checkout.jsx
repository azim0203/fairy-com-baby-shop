// Checkout Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../utils/storage';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: 'Surat',
        pincode: '',
        notes: ''
    });

    if (items.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Add some products before checkout.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
                    </div>
                </div>
            </main>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const subtotal = getTotal();
        const shipping = subtotal > 500 ? 0 : 50;

        const order = saveOrder({
            customer: formData,
            items: items,
            subtotal: subtotal,
            shipping: shipping,
            total: subtotal + shipping
        });

        clearCart();

        setTimeout(() => {
            navigate(`/order-success/${order.id}`);
        }, 1000);
    };

    const subtotal = getTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    return (
        <main className="checkout-page">
            <div className="container">
                <h1 className="mb-3">Checkout 📝</h1>

                <div className="checkout-layout">
                    <form onSubmit={handleSubmit}>
                        <div className="checkout-form-section">
                            <h3 className="form-section-title">Delivery Details</h3>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>Full Name *</label>
                                    <input type="text" name="name" className="input" required
                                        value={formData.name} onChange={handleChange} placeholder="Enter your name" />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" name="phone" className="input" required
                                        value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" name="email" className="input"
                                    value={formData.email} onChange={handleChange} placeholder="email@example.com" />
                            </div>

                            <div className="input-group">
                                <label>Delivery Address *</label>
                                <textarea name="address" className="input" required rows="3"
                                    value={formData.address} onChange={handleChange} placeholder="House/Flat No., Street, Area" />
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>City</label>
                                    <input type="text" name="city" className="input"
                                        value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Pincode *</label>
                                    <input type="text" name="pincode" className="input" required
                                        value={formData.pincode} onChange={handleChange} placeholder="395007" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Order Notes (Optional)</label>
                                <textarea name="notes" className="input" rows="2"
                                    value={formData.notes} onChange={handleChange} placeholder="Any special instructions..." />
                            </div>
                        </div>

                        <button type="submit" className={`btn btn-primary btn-lg checkout-btn mt-2 ${isSubmitting ? 'animate-pulse' : ''}`}
                            disabled={isSubmitting} style={{ width: '100%' }}>
                            {isSubmitting ? '⏳ Placing Order...' : '✅ Place Order - ₹' + total.toLocaleString()}
                        </button>
                    </form>

                    <div className="order-summary">
                        <h3 className="cart-summary-title">Order Summary</h3>

                        <div className="order-items">
                            {items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="order-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.name}</span>
                                        <span className="order-item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
