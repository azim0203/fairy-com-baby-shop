// Products Page - With Loading State
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function Products() {
    const { products, categories, loading } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const categoryFilter = searchParams.get('category') || 'all';

    useEffect(() => {
        let result = products;

        // Filter by category
        if (categoryFilter !== 'all') {
            result = result.filter(p => p.category === categoryFilter);
        }

        // Filter by search term
        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredProducts(result);
    }, [categoryFilter, searchTerm, products]);

    const handleCategoryChange = (category) => {
        if (category === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const getCategoryName = () => {
        if (categoryFilter === 'all') return 'All Products';
        const cat = categories.find(c => c.id === categoryFilter);
        return cat ? `${cat.icon} ${cat.name}` : 'Products';
    };

    return (
        <main className="products-page">
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">{getCategoryName()}</h1>
                    <p className="section-desc">
                        Discover our amazing collection of baby products
                    </p>
                </div>

                <div className="products-header">
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${categoryFilter === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.id)}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="search-box">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchTerm('')}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="products-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton-product" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <>
                        <p className="products-count">{filteredProducts.length} products found</p>
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🔍</div>
                        <h2>No Products Found</h2>
                        <p>Try adjusting your search or filter criteria</p>
                        {searchTerm && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
