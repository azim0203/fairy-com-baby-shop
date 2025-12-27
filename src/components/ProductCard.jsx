// ProductCard Component
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 500);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`}>
                <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    {discount > 0 && !product.badge && (
                        <span className="product-badge">{discount}% OFF</span>
                    )}
                </div>
            </Link>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                <div className="product-price">
                    <span className="price-current">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                </div>

                <button
                    className={`add-to-cart-btn ${isAdding ? 'animate-pulse' : ''}`}
                    onClick={handleAddToCart}
                >
                    {isAdding ? '✓ Added!' : '🛒 Add to Cart'}
                </button>
            </div>
        </div>
    );
}
