-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Convert reviews to hypertable for TimescaleDB
SELECT create_hypertable('reviews', 'created_at');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, price, description, image_url) VALUES
    ('Running Shoes', 89.99, 'Lightweight and durable running shoes perfect for daily training', 'https://picsum.photos/id/1/400'),
    ('Wireless Earbuds', 129.99, 'High-quality sound with active noise cancellation', 'https://picsum.photos/id/2/400'),
    ('Smart Watch', 199.99, 'Track your fitness and stay connected with this stylish smartwatch', 'https://picsum.photos/id/3/400'),
    ('Laptop Backpack', 49.99, 'Water-resistant backpack with multiple compartments', 'https://picsum.photos/id/4/400'),
    ('Coffee Maker', 79.99, 'Programmable coffee maker with thermal carafe', 'https://picsum.photos/id/5/400'),
    ('Yoga Mat', 29.99, 'Extra thick and comfortable yoga mat with carrying strap', 'https://picsum.photos/id/6/400'),
    ('Desk Lamp', 39.99, 'LED desk lamp with adjustable brightness and color temperature', 'https://picsum.photos/id/7/400'),
    ('Water Bottle', 24.99, 'Insulated stainless steel water bottle', 'https://picsum.photos/id/8/400'),
    ('Wireless Mouse', 34.99, 'Ergonomic wireless mouse with long battery life', 'https://picsum.photos/id/9/400'),
    ('Plant Pot', 19.99, 'Ceramic plant pot with drainage hole and saucer', 'https://picsum.photos/id/10/400');

-- Insert sample reviews with varying dates
INSERT INTO reviews (product_id, rating, content, created_at) VALUES
    -- January 2024
    (1, 5, 'Very comfortable and durable!', '2024-01-01'),
    (1, 4, 'Good for running, but a bit pricey', '2024-01-15'),
    (2, 5, 'Amazing sound quality!', '2024-01-02'),
    (2, 3, 'Battery life could be better', '2024-01-16'),
    -- February 2024
    (3, 4, 'Great fitness tracking features', '2024-02-03'),
    (3, 5, 'Love the design and functionality', '2024-02-17'),
    (4, 4, 'Perfect for daily commute', '2024-02-04'),
    (4, 5, 'Lots of storage space', '2024-02-18'),
    -- March 2024
    (5, 3, 'Makes good coffee but slow', '2024-03-05'),
    (5, 4, 'Easy to clean and use', '2024-03-19'),
    (6, 5, 'Very comfortable for yoga', '2024-03-06'),
    (6, 4, 'Good grip and thickness', '2024-03-20'),
    -- April 2024
    (7, 5, 'Perfect desk lighting', '2024-04-07'),
    (7, 4, 'Love the color options', '2024-04-21'),
    (8, 4, 'Keeps drinks cold for hours', '2024-04-08'),
    (8, 5, 'Great size and design', '2024-04-22'),
    -- May 2024
    (9, 3, 'Comfortable but connection issues', '2024-05-09'),
    (9, 4, 'Good value for money', '2024-05-23'),
    (10, 5, 'Beautiful design', '2024-05-10'),
    (10, 4, 'Perfect size for small plants', '2024-05-24');

-- Create a view for product review statistics
CREATE OR REPLACE VIEW product_review_stats AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    COUNT(r.id) as total_reviews,
    ROUND(AVG(r.rating)::numeric, 2) as average_rating,
    COUNT(CASE WHEN r.rating >= 4 THEN 1 END) as positive_reviews,
    COUNT(CASE WHEN r.rating <= 2 THEN 1 END) as negative_reviews
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name;

-- Create a continuous aggregate for monthly review statistics
CREATE MATERIALIZED VIEW monthly_review_stats
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 month', created_at) as month,
    COUNT(*) as total_reviews,
    ROUND(AVG(rating)::numeric, 2) as average_rating,
    COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
    COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews
FROM reviews
GROUP BY month;

-- Create a policy to refresh the continuous aggregate
SELECT add_continuous_aggregate_policy('monthly_review_stats',
    start_offset => INTERVAL '3 months',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 day'); 