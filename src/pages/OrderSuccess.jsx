// Order Success Page - Beautiful confirmation with timeline and details
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/storage';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    const WHATSAPP_NUMBER = '919173610588';

    // Generate WhatsApp message for order tracking
    const getWhatsAppTrackLink = () => {
        const message = `Hi! I placed an order.\n\nOrder ID: ${orderId}\nName: ${order?.customer?.name}\n\nPlease confirm my order status. 🙏`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    if (loading) {
        return (
            <main className="order-success-page">
                <div className="container">
                    <div className="success-loading">
                        <div className="loading-spinner">⏳</div>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="order-success-page">
            <div className="container">
                <div className="success-container animate-fadeIn">

                    {/* Success Header */}
                    <div className="success-header">
                        <div className="success-check">
                            <span className="check-icon">✓</span>
                        </div>
                        <h1>Order Placed Successfully! 🎉</h1>
                        <p>Thank you for shopping with Fairy.Com!</p>
                    </div>

                    {/* Order ID Card */}
                    <div className="order-id-card">
                        <span className="order-id-label">Order ID</span>
                        <span className="order-id-value">{orderId}</span>
                        <button
                            className="copy-btn"
                            onClick={() => {
                                navigator.clipboard.writeText(orderId);
                                alert('Order ID copied!');
                            }}
                        >
                            📋 Copy
                        </button>
                    </div>

                    {/* What's Next Timeline */}
                    <div className="whats-next-section">
                        <h3>📋 What Happens Next?</h3>
                        <div className="timeline">
                            <div className="timeline-item active">
                                <div className="timeline-icon">✅</div>
                                <div className="timeline-content">
                                    <strong>Order Received</strong>
                                    <p>We've received your order</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">📞</div>
                                <div className="timeline-content">
                                    <strong>Confirmation Call</strong>
                                    <p>We'll call you to confirm</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">📦</div>
                                <div className="timeline-content">
                                    <strong>Preparing Order</strong>
                                    <p>We'll pack your items</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-icon">🚚</div>
                                <div className="timeline-content">
                                    <strong>Out for Delivery</strong>
                                    <p>On the way to you!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    {order && (
                        <div className="order-summary-card">
                            <h3>🛒 Order Summary</h3>

                            <div className="order-items-preview">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item-mini">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">×{item.quantity}</span>
                                        <span className="item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="total-row">
                                    <span>Delivery</span>
                                    <span className={order.shipping === 0 ? 'free-delivery' : ''}>
                                        {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                                    </span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total Paid</span>
                                    <span>₹{order.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Details */}
                    {order && (
                        <div className="delivery-details-card">
                            <h3>📍 Delivery Details</h3>
                            <div className="delivery-info-grid">
                                <div className="info-item">
                                    <span className="info-label">Name</span>
                                    <span className="info-value">{order.customer?.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{order.customer?.phone}</span>
                                </div>
                                <div className="info-item full-width">
                                    <span className="info-label">Address</span>
                                    <span className="info-value">
                                        {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="success-actions">
                        <a
                            href={getWhatsAppTrackLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-lg"
                        >
                            💬 Track via WhatsApp
                        </a>
                        <Link to="/track-order" className="btn btn-primary btn-lg">
                            📦 Track Order
                        </Link>
                    </div>

                    <div className="success-actions-secondary">
                        <Link to="/products" className="btn btn-outline">
                            Continue Shopping 🛒
                        </Link>
                        <Link to="/" className="btn btn-secondary">
                            Go Home
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="help-text">
                        <p>📞 Need help? Call us at <a href="tel:+919173610588">+91 91736 10588</a></p>
                        <p>💬 Or message us on WhatsApp anytime!</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
