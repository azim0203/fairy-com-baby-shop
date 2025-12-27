// Track Order Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderById } from '../utils/storage';

export default function TrackOrder() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setSearched(true);

        if (!orderId.trim()) {
            setError('Please enter an Order ID');
            return;
        }

        const foundOrder = getOrderById(orderId.trim().toUpperCase());

        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            setOrder(null);
            setError('Order not found. Please check your Order ID.');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '#27AE60';
            case 'shipped': return '#3498DB';
            case 'confirmed': return '#F39C12';
            case 'cancelled': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '✅';
            case 'shipped': return '🚚';
            case 'confirmed': return '📦';
            case 'cancelled': return '❌';
            default: return '⏳';
        }
    };

    const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

    const getStepStatus = (step) => {
        if (!order) return 'inactive';
        const currentIndex = statusSteps.findIndex(s => s.toLowerCase() === order.status?.toLowerCase());
        const stepIndex = statusSteps.indexOf(step);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'inactive';
    };

    return (
        <main className="track-order-page">
            <div className="container">
                <h1>📦 Track Your Order</h1>
                <p className="track-subtitle">Enter your Order ID to check delivery status</p>

                <form onSubmit={handleSearch} className="track-form">
                    <div className="track-input-group">
                        <input
                            type="text"
                            className="track-input"
                            placeholder="Enter Order ID (e.g., FRY-XXXXXX)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                        />
                        <button type="submit" className="btn btn-primary">
                            🔍 Track
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="track-error">
                        <span>❌ {error}</span>
                    </div>
                )}

                {order && (
                    <div className="track-result">
                        <div className="order-status-header">
                            <span className="order-id">Order #{order.id}</span>
                            <span
                                className="order-status-badge"
                                style={{ background: getStatusColor(order.status) }}
                            >
                                {getStatusIcon(order.status)} {order.status || 'Pending'}
                            </span>
                        </div>

                        {/* Progress Tracker */}
                        <div className="status-tracker">
                            {statusSteps.map((step, index) => (
                                <div
                                    key={step}
                                    className={`status-step ${getStepStatus(step)}`}
                                >
                                    <div className="step-icon">
                                        {getStepStatus(step) === 'completed' ? '✓' : index + 1}
                                    </div>
                                    <span className="step-label">{step}</span>
                                </div>
                            ))}
                        </div>

                        {/* Order Details */}
                        <div className="order-details-card">
                            <h3>Order Details</h3>

                            <div className="detail-row">
                                <span>Order Date:</span>
                                <span>{new Date(order.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>

                            <div className="detail-row">
                                <span>Delivery Address:</span>
                                <span>
                                    {order.customer?.name}<br />
                                    {order.customer?.address}<br />
                                    {order.customer?.city} - {order.customer?.pincode}
                                </span>
                            </div>

                            <div className="detail-row">
                                <span>Contact:</span>
                                <span>{order.customer?.phone}</span>
                            </div>

                            <div className="order-items-list">
                                <h4>Items ({order.items?.length || 0})</h4>
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-total-row">
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="order-total-row">
                                <span>Delivery:</span>
                                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                            </div>
                            <div className="order-total-row total">
                                <span>Total:</span>
                                <span>₹{order.total?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="track-help">
                            <p>Need help? Contact us:</p>
                            <a href="https://wa.me/919173610588" className="btn btn-whatsapp">
                                💬 WhatsApp Support
                            </a>
                        </div>
                    </div>
                )}

                {searched && !order && !error && (
                    <div className="track-not-found">
                        <span>🔍</span>
                        <p>No order found with this ID</p>
                    </div>
                )}

                <div className="track-back">
                    <Link to="/" className="btn btn-outline">← Back to Shop</Link>
                </div>
            </div>
        </main>
    );
}
