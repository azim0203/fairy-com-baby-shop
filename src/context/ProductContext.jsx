// Product Context - Using Supabase for synced data across all devices
import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../lib/supabase';

const ProductContext = createContext();

const productReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            return { ...state, products: action.payload.products, categories: action.payload.categories, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'ADD_PRODUCT':
            return { ...state, products: [action.payload, ...state.products] };
        case 'UPDATE_PRODUCT':
            return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
        case 'DELETE_PRODUCT':
            return { ...state, products: state.products.filter(p => p.id !== action.payload) };
        case 'ADD_CATEGORY':
            return { ...state, categories: [...state.categories, action.payload] };
        case 'DELETE_CATEGORY':
            return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
        default:
            return state;
    }
};

export function ProductProvider({ children }) {
    const [state, dispatch] = useReducer(productReducer, { products: [], categories: [], loading: true });
    const [error, setError] = useState(null);

    // Load from Supabase on mount
    useEffect(() => {
        async function loadData() {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const [products, categories] = await Promise.all([
                    productsApi.getAll(),
                    categoriesApi.getAll()
                ]);

                // Transform products to match existing format
                const transformedProducts = products.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    originalPrice: p.original_price,
                    image: p.image,
                    description: p.description,
                    badge: p.badge,
                    quantity: p.quantity,
                    inStock: p.quantity > 0
                }));

                dispatch({
                    type: 'LOAD_DATA',
                    payload: { products: transformedProducts, categories }
                });
            } catch (err) {
                console.error('Error loading data:', err);
                setError(err.message);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
        loadData();
    }, []);

    const addProduct = async (product) => {
        try {
            const newProduct = await productsApi.add(product);
            const transformed = {
                id: newProduct.id,
                name: newProduct.name,
                category: newProduct.category,
                price: newProduct.price,
                originalPrice: newProduct.original_price,
                image: newProduct.image,
                description: newProduct.description,
                badge: newProduct.badge,
                quantity: newProduct.quantity,
                inStock: newProduct.quantity > 0
            };
            dispatch({ type: 'ADD_PRODUCT', payload: transformed });
            return transformed;
        } catch (err) {
            console.error('Error adding product:', err);
            throw err;
        }
    };

    const updateProduct = async (product) => {
        try {
            const updated = await productsApi.update(product.id, product);
            const transformed = {
                id: updated.id,
                name: updated.name,
                category: updated.category,
                price: updated.price,
                originalPrice: updated.original_price,
                image: updated.image,
                description: updated.description,
                badge: updated.badge,
                quantity: updated.quantity,
                inStock: updated.quantity > 0
            };
            dispatch({ type: 'UPDATE_PRODUCT', payload: transformed });
            return transformed;
        } catch (err) {
            console.error('Error updating product:', err);
            throw err;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productsApi.delete(id);
            dispatch({ type: 'DELETE_PRODUCT', payload: id });
        } catch (err) {
            console.error('Error deleting product:', err);
            throw err;
        }
    };

    const addCategory = async (category) => {
        try {
            const newCategory = await categoriesApi.add(category);
            dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
            return newCategory;
        } catch (err) {
            console.error('Error adding category:', err);
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await categoriesApi.delete(id);
            dispatch({ type: 'DELETE_CATEGORY', payload: id });
        } catch (err) {
            console.error('Error deleting category:', err);
            throw err;
        }
    };

    const getProductById = (id) => state.products.find(p => p.id === parseInt(id));
    const getProductsByCategory = (category) => category === 'all' ? state.products : state.products.filter(p => p.category === category);

    return (
        <ProductContext.Provider value={{
            products: state.products,
            categories: state.categories,
            loading: state.loading,
            error,
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
