CREATE TYPE user_role AS ENUM (
    'customer',
    'admin',
    'warehouse'
);

ALTER TABLE users
ADD COLUMN role user_role NOT NULL DEFAULT 'customer';