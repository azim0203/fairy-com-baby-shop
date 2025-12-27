// Order Success Page
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/storage';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const order = getOrderById(orderId);

    return (
        <main className="cart-page">
            <div className="container">
                <div className="order-success animate-fadeIn">
                    <div className="success-icon">✓</div>

                    <h1>Order Placed Successfully! 🎉</h1>
                    <p className="text-secondary">
                        Thank you for shopping with Fairy.com! We've received your order and will process it shortly.
                    </p>

                    <div className="order-id">
                        Order ID: <strong>{orderId}</strong>
                    </div>

                    {order && (
                        <div className="card p-3 text-center mb-3" style={{ marginTop: '2rem' }}>
                            <h4 className="mb-2">Order Details</h4>
                            <p><strong>Name:</strong> {order.customer.name}</p>
                            <p><strong>Phone:</strong> {order.customer.phone}</p>
                            <p><strong>Delivery Address:</strong> {order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
                            <p><strong>Total Amount:</strong> ₹{order.total.toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className="badge badge-warning">Pending</span></p>
                        </div>
                    )}

                    <p className="text-secondary">
                        📞 We'll call you at <strong>{order?.customer?.phone || 'your number'}</strong> to confirm your order.
                    </p>

                    <div className="flex gap-2 justify-center mt-3">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Continue Shopping 🛒
                        </Link>
                        <Link to="/" className="btn btn-secondary btn-lg">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
