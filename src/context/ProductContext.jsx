// Product Context - Dynamic Product & Category Management
// FIXED: Products persist even after code changes
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Default categories
const defaultCategories = [
    { id: 'toys', name: 'Toys', icon: '🧸' },
    { id: 'diapers', name: 'Diapers', icon: '👶' },
    { id: 'clothes', name: 'Clothes', icon: '👗' },
    { id: 'babycare', name: 'Baby Care', icon: '🍼' }
];

// Default products - ONLY used if no data exists
const defaultProducts = [
    {
        id: 1,
        name: "Educational Building Blocks Set",
        category: "toys",
        price: 899,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
        description: "Colorful building blocks that help develop motor skills and creativity. Perfect for ages 3-8 years.",
        badge: "Bestseller",
        quantity: 50
    },
    {
        id: 2,
        name: "Soft Plush Teddy Bear",
        category: "toys",
        price: 549,
        originalPrice: 749,
        image: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400",
        description: "Super soft and cuddly teddy bear made with premium quality fabric. Safe for all ages.",
        badge: "Sale",
        quantity: 30
    },
    {
        id: 3,
        name: "Premium Baby Diapers - Small (50 pcs)",
        category: "diapers",
        price: 699,
        originalPrice: 849,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        description: "Ultra-soft diapers with 12-hour leak protection. Suitable for 3-8 kg babies.",
        badge: "Best Value",
        quantity: 100
    },
    {
        id: 4,
        name: "Premium Baby Diapers - Medium (42 pcs)",
        category: "diapers",
        price: 749,
        originalPrice: 899,
        image: "https://images.unsplash.com/photo-1584839404742-635f6aa5a965?w=400",
        description: "Ultra-soft diapers with 12-hour leak protection. Suitable for 6-11 kg babies.",
        quantity: 80
    },
    {
        id: 5,
        name: "Baby Onesie Set (3 pcs)",
        category: "clothes",
        price: 799,
        originalPrice: 999,
        image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400",
        description: "Soft cotton onesies in pastel colors. Perfect for newborns. 0-6 months.",
        badge: "New",
        quantity: 40
    },
    {
        id: 6,
        name: "Baby Romper - Pink",
        category: "clothes",
        price: 449,
        originalPrice: 599,
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400",
        description: "Adorable pink romper with bunny ears hood. 100% cotton. 3-12 months.",
        quantity: 25
    },
    {
        id: 7,
        name: "Baby Feeding Bottle Set (3 pcs)",
        category: "babycare",
        price: 599,
        originalPrice: 799,
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400",
        description: "Anti-colic feeding bottles with natural flow. BPA-free. Safe for newborns.",
        badge: "BPA Free",
        quantity: 45
    },
    {
        id: 8,
        name: "Baby Skincare Gift Set",
        category: "babycare",
        price: 899,
        originalPrice: 1199,
        image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?w=400",
        description: "Complete set with baby lotion, shampoo, oil, and powder. Dermatologically tested.",
        badge: "Gift Set",
        quantity: 25
    }
];

const ProductContext = createContext();

const productReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            return { ...state, products: action.payload.products, categories: action.payload.categories };
        case 'ADD_PRODUCT': {
            const newProduct = { ...action.payload, id: Date.now(), inStock: action.payload.quantity > 0 };
            return { ...state, products: [...state.products, newProduct] };
        }
        case 'UPDATE_PRODUCT':
            return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...action.payload, inStock: action.payload.quantity > 0 } : p) };
        case 'DELETE_PRODUCT':
            return { ...state, products: state.products.filter(p => p.id !== action.payload) };
        case 'ADD_CATEGORY': {
            const newCat = { id: action.payload.id || action.payload.name.toLowerCase().replace(/\s+/g, ''), ...action.payload };
            return { ...state, categories: [...state.categories, newCat] };
        }
        case 'DELETE_CATEGORY':
            return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
        default:
            return state;
    }
};

// Check if data was ever initialized
const DATA_INITIALIZED_KEY = 'fairy_data_initialized';

export function ProductProvider({ children }) {
    const [state, dispatch] = useReducer(productReducer, { products: [], categories: [] });
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount - NEVER overwrite user data
    useEffect(() => {
        const wasInitialized = localStorage.getItem(DATA_INITIALIZED_KEY);
        const savedProducts = localStorage.getItem('fairy_products');
        const savedCategories = localStorage.getItem('fairy_categories');

        let products = [];
        let categories = [];

        // If data was ever saved before, ALWAYS use saved data
        if (wasInitialized === 'true') {
            products = savedProducts ? JSON.parse(savedProducts) : [];
            categories = savedCategories ? JSON.parse(savedCategories) : defaultCategories;
        } else {
            // First time - use defaults and mark as initialized
            products = defaultProducts;
            categories = defaultCategories;
            localStorage.setItem(DATA_INITIALIZED_KEY, 'true');
        }

        dispatch({
            type: 'LOAD_DATA',
            payload: { products, categories }
        });
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change - ALWAYS save
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('fairy_products', JSON.stringify(state.products));
            localStorage.setItem('fairy_categories', JSON.stringify(state.categories));
        }
    }, [state.products, state.categories, isLoaded]);

    const addProduct = (product) => dispatch({ type: 'ADD_PRODUCT', payload: product });
    const updateProduct = (product) => dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    const deleteProduct = (id) => dispatch({ type: 'DELETE_PRODUCT', payload: id });
    const addCategory = (category) => dispatch({ type: 'ADD_CATEGORY', payload: category });
    const deleteCategory = (id) => dispatch({ type: 'DELETE_CATEGORY', payload: id });
    const getProductById = (id) => state.products.find(p => p.id === parseInt(id));
    const getProductsByCategory = (category) => category === 'all' ? state.products : state.products.filter(p => p.category === category);

    return (
        <ProductContext.Provider value={{
            products: state.products,
            categories: state.categories,
            addProduct, updateProduct, deleteProduct,
            addCategory, deleteCategory,
            getProductById, getProductsByCategory
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProducts must be used within a ProductProvider');
    return context;
};
