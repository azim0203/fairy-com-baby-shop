// Navbar Component - Exact Logo Styling from Image
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const { getItemCount } = useCart();
    const { categories } = useProducts();
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-main">
                        <span className="logo-fairy">
                            <span style={{ color: '#F4D03F' }}>F</span>
                            <span style={{ color: '#E74C3C' }}>a</span>
                            <span style={{ color: '#27AE60' }}>i</span>
                            <span style={{ color: '#E67E22' }}>r</span>
                            <span style={{ color: '#3498DB' }}>y</span>
                            <span style={{ color: '#27AE60' }}>.</span>
                            <span style={{ color: '#E67E22' }}>C</span>
                            <span style={{ color: '#27AE60' }}>o</span>
                            <span style={{ color: '#E91E8C' }}>m</span>
                        </span>
                    </div>
                    <span className="logo-tagline">One stop for all your baby needs</span>
                </Link>

                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🏠 Home
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        🛍️ Shop
                    </NavLink>
                    {categories.slice(0, 4).map(cat => (
                        <NavLink key={cat.id} to={`/products?category=${cat.id}`} className="navbar-link">
                            {cat.icon} {cat.name}
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDark ? '☀️' : '🌙'}
                    </button>

                    <button className="cart-btn" onClick={() => navigate('/cart')} aria-label="View cart">
                        🛒
                        {getItemCount() > 0 && <span className="cart-count">{getItemCount()}</span>}
                    </button>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>🏠 Home</Link>
                    <Link to="/products" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>🛍️ Shop</Link>
                    {categories.map(cat => (
                        <Link key={cat.id} to={`/products?category=${cat.id}`} className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
                            {cat.icon} {cat.name}
                        </Link>
                    ))}
                    <Link to="/admin" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>📊 Admin</Link>
                </div>
            )}
        </nav>
    );
}
