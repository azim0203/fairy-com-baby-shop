// Home Page - Nursery Theme with White Banner Card
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function Home() {
    const { products, categories } = useProducts();
    const featuredProducts = products.slice(0, 8);
    const getCategoryCount = (catId) => products.filter(p => p.category === catId).length;

    return (
        <main>
            {/* Hero Section with Nursery Theme */}
            <section className="hero">
                {/* Floating clouds and stars */}
                <div className="hero-clouds">
                    <span className="hero-cloud">☁️</span>
                    <span className="hero-cloud">☁️</span>
                    <span className="hero-cloud">☁️</span>
                    <span className="hero-cloud">☁️</span>
                    <span className="hero-star">⭐</span>
                    <span className="hero-star">⭐</span>
                    <span className="hero-star">✨</span>
                </div>

                <div className="container">
                    {/* White Banner Card - Like the reference image */}
                    <div className="hero-banner">
                        <h1 className="hero-logo">
                            <span style={{ color: '#F4D03F' }}>F</span>
                            <span style={{ color: '#E74C3C' }}>a</span>
                            <span style={{ color: '#27AE60' }}>i</span>
                            <span style={{ color: '#E67E22' }}>r</span>
                            <span style={{ color: '#3498DB' }}>y</span>
                            <span style={{ color: '#27AE60' }}>.</span>
                            <span style={{ color: '#E67E22' }}>C</span>
                            <span style={{ color: '#27AE60' }}>o</span>
                            <span style={{ color: '#E91E8C' }}>m</span>
                        </h1>

                        <p className="hero-subtitle" style={{ color: '#5D4037', fontWeight: 800 }}>BABY SHOP</p>

                        {/* Baby product icons row */}
                        <div className="hero-icons-row">
                            <span className="hero-icon-item">🍼</span>
                            <span className="hero-icon-item">👶</span>
                            <span className="hero-icon-item">👕</span>
                            <span className="hero-icon-item">🧸</span>
                        </div>

                        <p className="hero-tagline">✨ One stop for all your baby needs ✨</p>

                        <div className="hero-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                🛒 Shop Now
                            </Link>
                            <Link to="/products?category=toys" className="btn btn-secondary btn-lg">
                                🧸 Explore Toys
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">🌈 Shop By Category</h2>
                        <p className="section-desc">Find everything your little one needs</p>
                    </div>

                    <div className="grid grid-4">
                        {categories.map((cat) => (
                            <Link to={`/products?category=${cat.id}`} key={cat.id}>
                                <div className="card category-card">
                                    <div className="category-icon">{cat.icon}</div>
                                    <h3 className="category-name">{cat.name}</h3>
                                    <p className="category-count">{getCategoryCount(cat.id)} Products</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">⭐ Featured Products</h2>
                        <p className="section-desc">Best sellers loved by parents</p>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <div className="products-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-2">
                            <p>No products available yet. Admin can add products!</p>
                        </div>
                    )}

                    <div className="text-center mt-2">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            View All Products →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">🚚</div>
                            <h4 className="feature-title">Fast Delivery</h4>
                            <p className="feature-text">Same day in Surat</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✅</div>
                            <h4 className="feature-title">Quality Assured</h4>
                            <p className="feature-text">100% genuine</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💰</div>
                            <h4 className="feature-title">Best Prices</h4>
                            <p className="feature-text">Affordable always</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🔄</div>
                            <h4 className="feature-title">Easy Returns</h4>
                            <p className="feature-text">7 days policy</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
