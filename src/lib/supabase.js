// Supabase Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnehiyfiqlpqnskwaqrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZWhpeWZpcWxwcW5za3dhcXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4OTE0MjUsImV4cCI6MjA4MjQ2NzQyNX0.7JDfIFgI-1S5iHvrXNYu9puLuTbR0tJxUwhLAubWqU4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to upload image to Supabase Storage
export async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Products API
export const productsApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async add(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                category: product.category,
                price: product.price,
                original_price: product.originalPrice || product.price,
                image: product.image,
                description: product.description || '',
                badge: product.badge || null,
                quantity: product.quantity || 0
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, product) {
        const { data, error } = await supabase
            .from('products')
            .update({
                name: product.name,
                category: product.category,
                price: product.price,
                original_price: product.originalPrice || product.price,
                image: product.image,
                description: product.description || '',
                badge: product.badge || null,
                quantity: product.quantity || 0
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Categories API
export const categoriesApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    async add(category) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                id: category.id || category.name.toLowerCase().replace(/\s+/g, ''),
                name: category.name,
                icon: category.icon || '📦'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Orders API
export const ordersApi = {
    async getAll() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async add(order) {
        const orderId = 'FRY-' + Date.now().toString(36).toUpperCase();

        const { data, error } = await supabase
            .from('orders')
            .insert([{
                order_id: orderId,
                customer_name: order.customer.name,
                customer_phone: order.customer.phone,
                customer_email: order.customer.email || null,
                customer_address: order.customer.address,
                customer_city: order.customer.city,
                customer_pincode: order.customer.pincode,
                items: order.items,
                subtotal: order.subtotal,
                shipping: order.shipping,
                total: order.total,
                status: 'pending',
                notes: order.customer.notes || null
            }])
            .select()
            .single();

        if (error) throw error;
        return { ...data, id: orderId };
    },

    async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getById(orderId) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_id', orderId)
            .single();

        if (error) return null;
        return data;
    }
};
