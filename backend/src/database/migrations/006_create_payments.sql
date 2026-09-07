CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'successful',
    'failed',
    'cancelled'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id),

    amount NUMERIC(12, 2) NOT NULL
        CHECK (amount >= 0),

    status payment_status NOT NULL DEFAULT 'pending',

    provider VARCHAR(50),

    provider_payment_id VARCHAR(255),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (order_id)
);

CREATE INDEX idx_payments_status
    ON payments(status);

CREATE INDEX idx_payments_provider_payment_id
    ON payments(provider_payment_id);