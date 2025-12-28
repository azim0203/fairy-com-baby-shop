// ProductCard Component - Improved with out of stock handling
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const isOutOfStock = product.quantity === 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 800);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <Link to={`/product/${product.id}`}>
                <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    {discount > 0 && !product.badge && (
                        <span className="product-badge sale">{discount}% OFF</span>
                    )}
                    {isOutOfStock && (
                        <div className="out-of-stock-tag">Out of Stock</div>
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
                    className={`add-to-cart-btn ${isAdding ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? '❌ Out of Stock' : (isAdding ? '✓ Added!' : '🛒 Add to Cart')}
                </button>
            </div>
        </div>
    );
}
