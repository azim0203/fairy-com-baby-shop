-- Fairy.Com Database Setup for Supabase
-- Run this in Supabase SQL Editor (supabase.com -> Your Project -> SQL Editor)

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '📦',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    image TEXT,
    description TEXT,
    badge TEXT,
    quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    customer_city TEXT NOT NULL,
    customer_pincode TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert Default Categories
INSERT INTO categories (id, name, icon) VALUES
    ('toys', 'Toys', '🧸'),
    ('diapers', 'Diapers', '👶'),
    ('clothes', 'Clothes', '👗'),
    ('babycare', 'Baby Care', '🍼')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Sample Products
INSERT INTO products (name, category, price, original_price, image, description, badge, quantity) VALUES
    ('Educational Building Blocks Set', 'toys', 899, 1299, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', 'Colorful building blocks that help develop motor skills and creativity.', 'Bestseller', 50),
    ('Soft Plush Teddy Bear', 'toys', 549, 749, 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400', 'Super soft and cuddly teddy bear made with premium quality fabric.', 'Sale', 30),
    ('Premium Baby Diapers - Small (50 pcs)', 'diapers', 699, 849, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'Ultra-soft diapers with 12-hour leak protection.', 'Best Value', 100),
    ('Baby Onesie Set (3 pcs)', 'clothes', 799, 999, 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400', 'Soft cotton onesies in pastel colors. Perfect for newborns.', 'New', 40),
    ('Baby Feeding Bottle Set (3 pcs)', 'babycare', 599, 799, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', 'Anti-colic feeding bottles with natural flow. BPA-free.', 'BPA Free', 45)
ON CONFLICT DO NOTHING;

-- 6. Enable Row Level Security (RLS) - Allow public read, authenticated write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories and products
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

-- Allow anyone to insert/update/delete (for demo - in production, restrict to admin)
CREATE POLICY "Allow public insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete categories" ON categories FOR DELETE USING (true);

CREATE POLICY "Allow public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);
