// Order Storage Utilities

// Generate unique order ID
export const generateOrderId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `FRY-${timestamp}-${random}`.toUpperCase();
};

// Get all orders
export const getOrders = () => {
    const orders = localStorage.getItem('fairy_orders');
    return orders ? JSON.parse(orders) : [];
};

// Save a new order
export const saveOrder = (orderData) => {
    const orders = getOrders();
    const newOrder = {
        id: generateOrderId(),
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem('fairy_orders', JSON.stringify(orders));
    return newOrder;
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
    const orders = getOrders();
    const updatedOrders = orders.map(order =>
        order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
    );
    localStorage.setItem('fairy_orders', JSON.stringify(updatedOrders));
    return updatedOrders;
};

// Get order by ID
export const getOrderById = (orderId) => {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
};

// Get orders by status
export const getOrdersByStatus = (status) => {
    const orders = getOrders();
    return orders.filter(order => order.status === status);
};

// Get order statistics
export const getOrderStats = () => {
    const orders = getOrders();
    return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        revenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
    };
};
