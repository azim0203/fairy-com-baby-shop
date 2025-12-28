// Order Storage Utilities - Using Supabase for synced orders across all devices
import { ordersApi } from '../lib/supabase';

// Generate unique order ID
export const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `FRY-${timestamp}-${random}`.toUpperCase();
};

// Get all orders (async - from Supabase)
export const getOrders = async () => {
    try {
        const orders = await ordersApi.getAll();
        // Transform to match expected format
        return orders.map(o => ({
            id: o.order_id,
            dbId: o.id,
            customer: {
                name: o.customer_name,
                phone: o.customer_phone,
                email: o.customer_email,
                address: o.customer_address,
                city: o.customer_city,
                pincode: o.customer_pincode
            },
            items: o.items,
            subtotal: o.subtotal,
            shipping: o.shipping,
            total: o.total,
            status: o.status,
            notes: o.notes,
            createdAt: o.created_at
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

// Save a new order (async - to Supabase)
export const saveOrder = async (orderData) => {
    try {
        const result = await ordersApi.add(orderData);
        return {
            id: result.order_id,
            ...orderData,
            status: 'pending',
            createdAt: result.created_at
        };
    } catch (error) {
        console.error('Error saving order:', error);
        // Fallback to localStorage if Supabase fails
        const orders = JSON.parse(localStorage.getItem('fairy_orders') || '[]');
        const newOrder = {
            id: generateOrderId(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.unshift(newOrder);
        localStorage.setItem('fairy_orders', JSON.stringify(orders));
        return newOrder;
    }
};

// Update order status (async - in Supabase)
export const updateOrderStatus = async (orderId, status, dbId) => {
    try {
        await ordersApi.updateStatus(dbId, status);
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
};

// Get order by ID (async - from Supabase)
export const getOrderById = async (orderId) => {
    try {
        const order = await ordersApi.getById(orderId);
        if (!order) return null;

        return {
            id: order.order_id,
            dbId: order.id,
            customer: {
                name: order.customer_name,
                phone: order.customer_phone,
                email: order.customer_email,
                address: order.customer_address,
                city: order.customer_city,
                pincode: order.customer_pincode
            },
            items: order.items,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
            status: order.status,
            notes: order.notes,
            date: order.created_at
        };
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};

// Get order statistics (async - from Supabase)
export const getOrderStats = async () => {
    try {
        const orders = await ordersApi.getAll();
        return {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            processing: orders.filter(o => o.status === 'processing').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            revenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total), 0)
        };
    } catch (error) {
        console.error('Error fetching order stats:', error);
        return { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, revenue: 0 };
    }
};
