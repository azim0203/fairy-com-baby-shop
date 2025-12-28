// My Orders Page - Customer Order History
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { supabase } from '../lib/supabase';

export default function MyOrders() {
    const { customer, isLoggedIn, signOut, customerName, customerEmail } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/account');
            return;
        }
        fetchMyOrders();
    }, [isLoggedIn, navigate]);

    const fetchMyOrders = async () => {
        try {
            // Fetch orders where customer email matches
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', customerEmail)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '#27AE60';
            case 'shipped': return '#3498DB';
            case 'processing': return '#F39C12';
            case 'cancelled': return '#E74C3C';
            default: return '#95A5A6';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return '✅';
            case 'shipped': return '🚚';
            case 'processing': return '📦';
            case 'cancelled': return '❌';
            default: return '⏳';
        }
    };

    if (loading) {
        return (
            <main className="my-orders-page">
                <div className="container">
                    <div className="loading-state">
                        <span>⏳</span>
                        <p>Loading your orders...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="my-orders-page">
            <div className="container">
                {/* Account Header */}
                <div className="account-header">
                    <div className="account-info">
                        <div className="account-avatar">👤</div>
                        <div>
                            <h2>Hello, {customerName}!</h2>
                            <p>{customerEmail}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        🚪 Logout
                    </button>
                </div>

                {/* Orders Section */}
                <div className="orders-section">
                    <h3>📦 My Orders</h3>

                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <span className="no-orders-icon">🛒</span>
                            <h4>No orders yet</h4>
                            <p>Start shopping to see your orders here!</p>
                            <Link to="/products" className="btn btn-primary">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-id-info">
                                            <span className="order-id-label">Order ID</span>
                                            <span className="order-id-value">{order.order_id}</span>
                                        </div>
                                        <span
                                            className="order-status-badge"
                                            style={{ background: getStatusColor(order.status) }}
                                        >
                                            {getStatusIcon(order.status)} {order.status || 'Pending'}
                                        </span>
                                    </div>

                                    <div className="order-card-body">
                                        <div className="order-date">
                                            📅 {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>

                                        <div className="order-items-summary">
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="item-preview">
                                                    {item.name} ×{item.quantity}
                                                </span>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <span className="more-items">
                                                    +{order.items.length - 2} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="order-total">
                                            Total: <strong>₹{Number(order.total).toLocaleString()}</strong>
                                        </div>
                                    </div>

                                    <div className="order-card-footer">
                                        <Link
                                            to={`/track-order`}
                                            className="btn btn-outline btn-sm"
                                            onClick={() => {
                                                // Store order ID for tracking page
                                                sessionStorage.setItem('trackOrderId', order.order_id);
                                            }}
                                        >
                                            📍 Track Order
                                        </Link>
                                        <a
                                            href={`https://wa.me/919173610588?text=Hi! I need help with my order ${order.order_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-whatsapp btn-sm"
                                        >
                                            💬 Need Help?
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="back-to-shop">
                    <Link to="/products" className="btn btn-primary">
                        🛒 Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
