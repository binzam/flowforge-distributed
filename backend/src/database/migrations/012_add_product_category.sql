CREATE TYPE product_category AS ENUM (
    'electronics',
    'fashion',
    'home_kitchen',
    'beauty_personal_care',
    'sports_outdoors',
    'toys_games',
    'books',
    'automotive'
);

ALTER TABLE products
    ADD COLUMN category product_category;

-- Placeholder backfill for existing rows so the column can be NOT NULL.
-- Replace 'electronics' with real mappings if the table holds real data.
UPDATE products
SET category = 'electronics'
WHERE category IS NULL;

ALTER TABLE products
    ALTER COLUMN category SET NOT NULL;

CREATE INDEX idx_products_category_created_at
    ON products(category, created_at DESC)
    WHERE is_active = TRUE;