// Product Detail Page - With Loading State and Improved UX
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading, getProductById } = useProducts();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!loading && products.length > 0) {
            const found = getProductById(id);
            setProduct(found);
        }
    }, [id, loading, products, getProductById]);

    // Loading state
    if (loading) {
        return (
            <main className="product-detail">
                <div className="container">
                    <div className="product-detail-grid">
                        <div className="skeleton-image" />
                        <div className="skeleton-info">
                            <div className="skeleton-line short" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line medium" />
                            <div className="skeleton-line long" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Product not found
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

    const isOutOfStock = product.quantity === 0;

    return (
        <main className="product-detail">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>›</span>
                    <Link to="/products">Products</Link>
                    <span>›</span>
                    <span>{product.name}</span>
                </div>

                <div className="product-detail-grid">
                    <div className="product-gallery">
                        <div className="product-main-image">
                            <img src={product.image} alt={product.name} />
                            {product.badge && (
                                <span className="product-badge-large">{product.badge}</span>
                            )}
                            {isOutOfStock && (
                                <div className="out-of-stock-overlay">Out of Stock</div>
                            )}
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

                        <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
                            {isOutOfStock ? (
                                <span>❌ Out of Stock</span>
                            ) : (
                                <span>✅ {product.quantity} in stock</span>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {!isOutOfStock && (
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
                        )}

                        <div className="product-detail-actions">
                            <button
                                className={`btn btn-primary btn-lg ${isAdding ? 'animate-pulse' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                            >
                                {isOutOfStock ? '❌ Out of Stock' : (isAdding ? '✓ Added!' : '🛒 Add to Cart')}
                            </button>
                            <Link to="/products" className="btn btn-secondary btn-lg">
                                ← Back to Shop
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="trust-badges">
                            <span>✅ 100% Genuine</span>
                            <span>🚚 Fast Delivery</span>
                            <span>🔄 Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
