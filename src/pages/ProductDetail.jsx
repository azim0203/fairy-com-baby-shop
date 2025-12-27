// Product Detail Page - Using Dynamic Products
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById } = useProducts();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const product = getProductById(id);

    if (!product) {
        return (
            <main className="container">
                <div className="empty-cart">
                    <div className="empty-cart-icon">❓</div>
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist.</p>
                    <Link to="/products" className="btn btn-primary">Browse Products</Link>
                </div>
            </main>
        );
    }

    const handleAddToCart = () => {
        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setTimeout(() => {
            setIsAdding(false);
            navigate('/cart');
        }, 500);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="product-detail">
            <div className="container">
                <div className="product-detail-grid">
                    <div className="product-gallery">
                        <div className="product-main-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-detail-info">
                        <span className="product-category">{product.category}</span>
                        <h1>{product.name}</h1>

                        <div className="product-detail-price">
                            <span className="price-current">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                                    <span className="badge badge-success">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        {product.quantity !== undefined && (
                            <p className="text-secondary mb-2">
                                📦 {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                            </p>
                        )}

                        <p className="product-description">{product.description}</p>

                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-control">
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >−</button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.min(product.quantity || 99, quantity + 1))}
                                >+</button>
                            </div>
                        </div>

                        <div className="product-detail-actions">
                            <button
                                className={`btn btn-primary btn-lg ${isAdding ? 'animate-pulse' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.quantity === 0}
                            >
                                {isAdding ? '✓ Added!' : '🛒 Add to Cart'}
                            </button>
                            <Link to="/products" className="btn btn-secondary btn-lg">
                                ← Back to Shop
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
