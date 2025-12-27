// Admin Dashboard with Product & Category Management
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { getOrders, updateOrderStatus, getOrderStats } from '../../utils/storage';

export default function Dashboard() {
    const navigate = useNavigate();
    const { isAdmin, logout } = useAuth();
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory } = useProducts();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, shipped: 0, delivered: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState('orders');

    // Product Modal
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', category: 'toys', price: '', originalPrice: '', quantity: '', image: '', description: '', badge: ''
    });

    // Category Modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '', icon: '📦' });

    useEffect(() => {
        if (!isAdmin) { navigate('/admin'); return; }
        loadData();
    }, [isAdmin, navigate]);

    const loadData = () => {
        setOrders(getOrders());
        setStats(getOrderStats());
    };

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        loadData();
    };

    const handleLogout = () => { logout(); navigate('/admin'); };

    // Product handlers
    const openAddProduct = () => {
        setEditingProduct(null);
        setProductForm({ name: '', category: categories[0]?.id || 'toys', price: '', originalPrice: '', quantity: '', image: '', description: '', badge: '' });
        setShowProductModal(true);
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name, category: product.category,
            price: product.price.toString(), originalPrice: product.originalPrice?.toString() || '',
            quantity: product.quantity?.toString() || '0', image: product.image,
            description: product.description || '', badge: product.badge || ''
        });
        setShowProductModal(true);
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...productForm,
            price: parseInt(productForm.price),
            originalPrice: productForm.originalPrice ? parseInt(productForm.originalPrice) : null,
            quantity: parseInt(productForm.quantity) || 0
        };
        if (editingProduct) updateProduct({ ...productData, id: editingProduct.id });
        else addProduct(productData);
        setShowProductModal(false);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Delete this product?')) deleteProduct(id);
    };

    // Category handlers
    const handleAddCategory = (e) => {
        e.preventDefault();
        if (categoryForm.name.trim()) {
            addCategory({ name: categoryForm.name.trim(), icon: categoryForm.icon || '📦' });
            setCategoryForm({ name: '', icon: '📦' });
            setShowCategoryModal(false);
        }
    };

    const handleDeleteCategory = (id) => {
        const hasProducts = products.some(p => p.category === id);
        if (hasProducts) {
            alert('Cannot delete! Move products to another category first.');
            return;
        }
        if (window.confirm('Delete this category?')) deleteCategory(id);
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-logo">🧚 Fairy.Com</h2>
                <ul className="admin-menu">
                    <li><button onClick={() => setActiveTab('orders')} className={`admin-menu-link ${activeTab === 'orders' ? 'active' : ''}`}>📦 Orders</button></li>
                    <li><button onClick={() => setActiveTab('products')} className={`admin-menu-link ${activeTab === 'products' ? 'active' : ''}`}>🛍️ Products</button></li>
                    <li><button onClick={() => setActiveTab('categories')} className={`admin-menu-link ${activeTab === 'categories' ? 'active' : ''}`}>📂 Categories</button></li>
                    <li><Link to="/" className="admin-menu-link">🏠 View Store</Link></li>
                    <li><button onClick={handleLogout} className="admin-menu-link">🚪 Logout</button></li>
                </ul>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <h1 className="admin-title">
                        {activeTab === 'orders' ? '📦 Orders' : activeTab === 'products' ? '🛍️ Products' : '📂 Categories'}
                    </h1>
                    {activeTab === 'products' && <button onClick={openAddProduct} className="btn btn-primary">➕ Add Product</button>}
                    {activeTab === 'categories' && <button onClick={() => setShowCategoryModal(true)} className="btn btn-primary">➕ Add Category</button>}
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card"><div className="stat-icon orders">📦</div><div className="stat-value">{stats.total}</div><div className="stat-label">Orders</div></div>
                    <div className="stat-card"><div className="stat-icon pending">⏳</div><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending</div></div>
                    <div className="stat-card"><div className="stat-icon products">🛍️</div><div className="stat-value">{products.length}</div><div className="stat-label">Products</div></div>
                    <div className="stat-card"><div className="stat-icon revenue">💰</div><div className="stat-value">₹{stats.revenue.toLocaleString()}</div><div className="stat-label">Revenue</div></div>
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-table">
                        <div className="table-header">
                            <h3 className="table-title">Recent Orders</h3>
                            <button onClick={loadData} className="btn btn-secondary">🔄 Refresh</button>
                        </div>
                        {orders.length === 0 ? (
                            <div className="empty-state"><div className="empty-icon">📦</div><h3>No Orders Yet</h3></div>
                        ) : (
                            <div className="table-responsive">
                                <table>
                                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="order-id-cell">{order.id}</td>
                                                <td><strong>{order.customer.name}</strong><br /><span className="text-small">{order.customer.phone}</span></td>
                                                <td>{order.items.length} items</td>
                                                <td><strong>₹{order.total.toLocaleString()}</strong></td>
                                                <td className="text-small">{formatDate(order.createdAt)}</td>
                                                <td>
                                                    <select className="status-select" value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                                                        <option value="pending">⏳ Pending</option>
                                                        <option value="processing">🔄 Processing</option>
                                                        <option value="shipped">🚚 Shipped</option>
                                                        <option value="delivered">✅ Delivered</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="products-admin-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-admin-card">
                                <div className="product-admin-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.badge && <span className="product-badge">{product.badge}</span>}
                                </div>
                                <div className="product-admin-info">
                                    <span className="product-category">{product.category}</span>
                                    <h4>{product.name}</h4>
                                    <div className="product-price">
                                        <span className="price-current">₹{product.price}</span>
                                        {product.originalPrice && <span className="price-original">₹{product.originalPrice}</span>}
                                    </div>
                                    <div className="product-stock">📦 Stock: <strong>{product.quantity || 0}</strong></div>
                                    <div className="product-admin-actions">
                                        <button onClick={() => openEditProduct(product)} className="btn btn-secondary btn-sm">✏️ Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger btn-sm">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="categories-admin-grid">
                        {categories.map((cat) => (
                            <div key={cat.id} className="category-admin-card">
                                <div className="category-icon-large">{cat.icon}</div>
                                <h3>{cat.name}</h3>
                                <p>{products.filter(p => p.category === cat.id).length} products</p>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-danger btn-sm">🗑️ Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Product Modal */}
                {showProductModal && (
                    <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add Product'}</h2>
                            <form onSubmit={handleProductSubmit}>
                                <div className="input-group">
                                    <label>Product Name *</label>
                                    <input type="text" className="input" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Category *</label>
                                        <select className="input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Quantity *</label>
                                        <input type="number" className="input" required min="0" value={productForm.quantity} onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>Price (₹) *</label>
                                        <input type="number" className="input" required min="1" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Original Price</label>
                                        <input type="number" className="input" min="0" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Image URL *</label>
                                    <input type="url" className="input" required placeholder="https://..." value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Description</label>
                                    <textarea className="input" rows="2" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Badge (Sale, New, etc.)</label>
                                    <input type="text" className="input" value={productForm.badge} onChange={e => setProductForm({ ...productForm, badge: e.target.value })} />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingProduct ? 'Update' : 'Add'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Category Modal */}
                {showCategoryModal && (
                    <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                        <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
                            <h2>➕ Add Category</h2>
                            <form onSubmit={handleAddCategory}>
                                <div className="input-group">
                                    <label>Category Name *</label>
                                    <input type="text" className="input" required placeholder="e.g., Footwear" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Icon (emoji)</label>
                                    <input type="text" className="input" placeholder="👟" value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
