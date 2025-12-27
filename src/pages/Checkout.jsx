// Checkout Page with WhatsApp Order and Dynamic Delivery Charges
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../utils/storage';
import { calculateDeliveryCharge, getDeliveryEstimate } from '../utils/delivery';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({ charge: 0, label: '', valid: false });
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: 'Surat',
        pincode: '',
        notes: ''
    });

    // WhatsApp number
    const WHATSAPP_NUMBER = '919173610588';

    // Calculate delivery when pincode changes
    useEffect(() => {
        if (formData.pincode.length === 6) {
            const subtotal = getTotal();
            const info = calculateDeliveryCharge(formData.pincode, subtotal);
            setDeliveryInfo(info);
        } else {
            setDeliveryInfo({ charge: 0, label: 'Enter 6-digit pincode', valid: false });
        }
    }, [formData.pincode, getTotal]);

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

    const subtotal = getTotal();
    const shipping = deliveryInfo.valid ? deliveryInfo.charge : 0;
    const total = subtotal + shipping;

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        let message = `🧚 *NEW ORDER - Fairy.Com*\n\n`;
        message += `👤 *Customer:* ${formData.name}\n`;
        message += `📞 *Phone:* ${formData.phone}\n`;
        if (formData.email) message += `📧 *Email:* ${formData.email}\n`;
        message += `📍 *Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n`;
        message += `🚚 *Delivery:* ${deliveryInfo.label}\n`;
        if (formData.notes) message += `📝 *Notes:* ${formData.notes}\n`;
        message += `\n📦 *ORDER ITEMS:*\n`;
        message += `─────────────────\n`;

        items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
        });

        message += `─────────────────\n`;
        message += `💰 Subtotal: ₹${subtotal}\n`;
        message += `🚚 Delivery: ${shipping === 0 ? 'FREE' : '₹' + shipping}\n`;
        message += `✨ *TOTAL: ₹${total}*\n\n`;
        message += `Thank you for ordering! 🙏`;

        return encodeURIComponent(message);
    };

    const handleWhatsAppOrder = () => {
        if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
            alert('Please fill in all required fields (Name, Phone, Address, Pincode)');
            return;
        }

        if (!deliveryInfo.valid) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

        // Save order locally too
        saveOrder({
            customer: formData,
            items: items,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            deliveryInfo: deliveryInfo.label,
            orderMethod: 'whatsapp'
        });

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Clear cart after a delay
        setTimeout(() => {
            clearCart();
            navigate('/');
            alert('Order sent via WhatsApp! We will contact you shortly.');
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!deliveryInfo.valid) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        setIsSubmitting(true);

        const order = saveOrder({
            customer: formData,
            items: items,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            deliveryInfo: deliveryInfo.label
        });

        clearCart();

        setTimeout(() => {
            navigate(`/order-success/${order.id}`);
        }, 1000);
    };

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
                                    <label>Pincode * (6 digits)</label>
                                    <input type="text" name="pincode" className="input" required
                                        value={formData.pincode} onChange={handleChange} placeholder="394210"
                                        maxLength="6" pattern="[0-9]{6}" />
                                </div>
                            </div>

                            {/* Delivery Charge Info */}
                            {formData.pincode.length === 6 && (
                                <div className="delivery-info">
                                    <div className="delivery-info-row">
                                        <span className="delivery-label">🚚 {deliveryInfo.label}</span>
                                        <span className="delivery-charge">
                                            {deliveryInfo.charge === 0 ? 'FREE' : `₹${deliveryInfo.charge}`}
                                        </span>
                                    </div>
                                    <div className="delivery-estimate">
                                        📅 Estimated: {getDeliveryEstimate(formData.pincode)}
                                    </div>
                                </div>
                            )}

                            <div className="input-group">
                                <label>Order Notes (Optional)</label>
                                <textarea name="notes" className="input" rows="2"
                                    value={formData.notes} onChange={handleChange} placeholder="Any special instructions..." />
                            </div>
                        </div>

                        {/* WhatsApp Order Button */}
                        <button type="button" onClick={handleWhatsAppOrder}
                            className="btn btn-lg mt-2"
                            style={{
                                width: '100%',
                                background: '#25D366',
                                color: 'white',
                                marginBottom: '0.75rem'
                            }}>
                            📱 Order via WhatsApp - ₹{total.toLocaleString()}
                        </button>

                        <button type="submit" className={`btn btn-primary btn-lg checkout-btn ${isSubmitting ? 'animate-pulse' : ''}`}
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
                            <span>Delivery</span>
                            <span style={{ color: shipping === 0 ? '#27AE60' : 'inherit' }}>
                                {deliveryInfo.valid ? (shipping === 0 ? 'FREE' : `₹${shipping}`) : '—'}
                            </span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        {/* Track Order Link */}
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <Link to="/track-order" style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                                📦 Already ordered? Track your order
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
