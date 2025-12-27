// Cart Page
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, getTotal } = useCart();

    if (items.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added any products yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping →
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const subtotal = getTotal();
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + shipping;

    return (
        <main className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart 🛒</h1>
                    <p className="text-secondary">{items.length} item(s) in your cart</p>
                </div>

                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>

                                <div className="cart-item-details">
                                    <span className="cart-item-category">{item.category}</span>
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <span className="cart-item-price">₹{item.price.toLocaleString()}</span>

                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >−</button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3 className="cart-summary-title">Order Summary</h3>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>

                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>

                        {shipping === 0 && (
                            <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                                🎉 Free delivery on orders above ₹500
                            </div>
                        )}

                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                            Proceed to Checkout →
                        </Link>

                        <Link to="/products" className="btn btn-secondary checkout-btn" style={{ marginTop: '0.5rem' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
